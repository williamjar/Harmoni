import {Ticket} from "../.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import axios from "axios";
import {Artist} from "../classes/artist";
import {TicketType} from "../classes/ticketType";

export class TicketStore {

    //Adds ticket
    static addTicket(callback, list) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
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
/*
    static getArtist(artistID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/' + artistID, {headers: header}).then(response => {
                let artist = new Artist(response.data[0].artistID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].genre, response.data[0].organizerID);
                callback(artist);
            }
        );
    }

 */

    //reteurn all tickets in a event
}