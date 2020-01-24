import axios from "axios";
import {TicketType} from "../classes/ticketType";
import {CookieStore} from "./cookieStore";

const axiosConfig = require("./axiosConfig");

/**
 * @class TicketStore
 * @classdesc Store class for functions related to accessing and modifying tickets. Tickets refer to the type of ticket
 * available in an event. Tickets are specific for each event.
 */
export class TicketStore {

    static allTicketsCurrentEvent = [];
    static allTickets = [];

    /**
     * Add a new ticket to the database.
     * @param {int} eventID - The database ID of the event.
     * @param {string} name - The name of the ticket.
     * @param {int} price - The price of the ticket
     * @param {int} amount - The amount of tickets.
     * @param {string} releaseDate - The date of release.
     * @param {string} releaseTime - The time of release.
     * @param {string} endDate - The end date of ticket sales.
     * @param {string} endTime - The end time of ticket sales.
     * @param {string} description - Description of the ticket type.
     * @param {function} callback
     */
    static addTicket(eventID, name, price, amount, releaseDate, releaseTime,  endDate, endTime, description, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let list = {
            "eventID" : eventID,
            "ticketTypeName" : name,
            "price" : price,
            "amount" : amount,
            "releaseDate" : releaseDate,
            "releaseTime" : releaseTime,
            "hasEndDate" : 1,
            "endDate" : endDate,
            "endTime" : endTime,
            "description" : description

        };

        axios.post(axiosConfig.root + '/api/ticket/insert', list, {headers: header}).then(response => {
            console.log(response);
            if (response.status === 200){
                callback(200);
            }
            else{
                callback(501);
            }
        });
    }

    static getOneTicket(ticketTypeID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/ticket/' + ticketTypeID, {headers: header}).then(response => {
                let ticket = new TicketType(response.data[0].ticketTypeID, response.data[0].ticketTypeName, response.data[0].price, response.data[0].amount,
                                            response.data[0].releaseDate, response.data[0].releaseTime, response.data[0].hasEndDate,
                                            response.data[0].endDate, response.data[0].endTime, response.data[0].description);
                callback(ticket);
            }
        );
    }

    /**
     * Inserts all tickets for a specific events into the allTicketsCurrentEvent variable with data from the database.
     * @param {int} eventID - The database ID of the event.
     * @param {function} callback
     */
    static getAllTicketsForEvent(eventID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/ticket/allTickets/' + eventID, {headers: header}).then(response =>  {
            this.allTicketsCurrentEvent = [];

            this.allTicketsCurrentEvent = response.data.map(data => new TicketType(data.ticketTypeID, data.ticketTypeName, data.price, data.amount,
                data.releaseDate, data.releaseTime, data.hasEndDate, data.endDate, data.endTime, data.description));

            callback();
        });
    }


    static updateTicket(name, price, amount, releaseDate, releaseTime,  endDate, endTime, description, ticketTypeID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.put(axiosConfig.root + '/api/ticket/' + ticketTypeID, {
            "ticketTypeID" : name,
            "price" : price,
            "amount" : amount,
            "releaseDate" : releaseDate,
            "releaseTime" : releaseTime,
            "endDate" : endDate,
            "endTime" : endTime,
            "description" : description,
            "ticketTypeId" : ticketTypeID

        }, {headers: header})
            .catch(error => console.log(error));
    }

    /**
     * Removes a specific ticket from the database.
     * @param {int} eventID - The database ID of the event.
     * @param {int} ticketTypeID - The database ID of the ticket.
     * @param {function} callback - Returns a status for how the event went.
     * @return {Promise} The returned promise from the database call.
     */
    static deleteTicket(eventID ,ticketTypeID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/ticket/' + eventID + '/' + ticketTypeID , {headers: header}).then(response => {
            if (response.status === 200){
                callback(200);
            }
            else{
                callback(501);
            }
        });
    }
}
