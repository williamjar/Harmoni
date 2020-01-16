import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import axios from "axios";
import {TicketType} from "../classes/ticketType";

const axiosConfig = require("./axiosConfig");

export class TicketStore {

    //Adds ticket
    static addTicket(eventID, name, price, amount, releaseDate, releaseTime,  endDate, endTime, description ) {

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
        });
    }

    //returns one ticket
    //ticketTypeID, price, amount, releaseDate, releaseTime, hasEndDate, endDate, endTime, description

    static getOneTicket(ticketTypeID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/ticket/:ticketTypeID' + ticketTypeID, {headers: header}).then(response => {
                let ticket = new TicketType(response.data[0].ticketTypeID, response.data[0].price, response.data[0].amount,
                                            response.data[0].releaseDate, response.data[0].releaseTime, response.data[0].hasEndDate,
                                            response.data[0].endDate, response.data[0].endTime, response.data[0].description);
                callback(ticket);
            }
        );
    }
    //reteurn all tickets in a event
}