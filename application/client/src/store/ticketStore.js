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
}