import {CookieStore} from "./cookieStore";
import axios from "axios";
import {TicketType} from "../classes/ticketType";

const axiosConfig = require("./axiosConfig");

export class TicketStore {

    static allTickets = [];

    //Adds ticket
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

    //returns one ticket
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

    //return all tickets to an event in a list.
    static  getAllTickets(eventID, callback) {

        this.allTickets = [];

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/ticket/allTickets/' + eventID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                this.allTickets.push(new TicketType(response.data[i].ticketTypeID, response.data[i].ticketTypeName , response.data[i].price, response.data[i].amount, response.data[i].releaseDate,
                                                response.data[i].releaseTime, response.data[i].hasEndDate, response.data[i].endDate,
                                                response.data[i].endTime, response.data[i].description));
            }
            callback();
        });

    }

    //update ticket
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


    //delete a ticket from an event
    static deleteTicket(eventID ,ticketTypeID, callback) {
        console.log('Running deleteTicket');
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/ticket/' + eventID + '/' + ticketTypeID , {headers: header}).then(response => {
            console.log(response);
            if (response.status === 200){
                callback(200);
            }
            else{
                callback(501);
            }
        });
    }
}
