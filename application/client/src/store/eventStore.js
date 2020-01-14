import axios from "axios";
import Event from "../classes/event.js";
import {CookieStore} from "../store/cookieStore.js";
import {forEach} from "react-bootstrap/esm/ElementChildren";

let axiosConfig = require("./axiosConfig");

export class eventStore{

    static currentEvent = null;

    static allEvents = [];

    static allEventsForOrganizer = [];


    static createEvent(callback, eventName, organizerID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        // ^ Unsure if callback is needed for this method ^
        //Call to create an event

        axios.post(axiosConfig.root + "/api/events" , {headers: header}).then(response =>{

            //Create an event from the insertID returned from the query and the organizerID, the rest is null
            this.currentEvent = new Event(response.data.insertId, null, null, null, null, null, null, null, null, null, null, null, null, null, organizerID, null);
            callback();
        });


    }


    static storeCurrentEvent(eventID){

        //Populates currentEvent

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.get(axiosConfig.root + "/login", {headers: header}).then(response => {
            this.currentEvent = new Event(response.data[0].eventID, response.data[0].eventName,
                response.data[0].startDate, response.data[0].endDate, response.data[0].startTime,
                response.data[0].endTime, response.data[0].address, response.data[0].town,
                response.data[0].zipCode, response.data[0].status, response.data[0].description,
                response.data[0].publishDate, response.data[0].publishTime, response.data[0].organizerID,
                response.data[0].pictureID);
        });
    }

    static postCurrentEvent(){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let body = {
            "eventID" : currentEvent.eventID,
            "eventName" : currentEvent.eventName,
            "startDate" : currentEvent.startDate,
            "endDate" : currentEvent.endDate,
            "startTime" : currentEvent.startDate,
            "endTime" : currentEvent.endTime,
            "address" : currentEvent.address,
            "town" : currentEvent.town,
            "zipCode" : currentEvent.zipCode,
            "status" : currentEvent.status,
            "description" : currentEvent.description,
            "publishDate" : currentEvent.publishDate,
            "publishTime" : currentEvent.publishTime,
            "organizerID" : currentEvent.organizer,
            "pictureID" : currentEvent.picture
        };

        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID, body.json.stringify(), {headers: header});
    }

    static storeAllEvents(){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/events", {headers: header}).then( response => {
            this.allEvents = null;
            for (let i = 0; i < response.data.length; i++) {
                this.allEvents.push(new Event(response.data[i].eventID, response.data[i].eventName,
                    response.data[i].startDate, response.data[i].endDate, response.data[i].startTime,
                    response.data[i].endTime, response.data[i].address, response.data[i].town,
                    response.data[i].zipCode, response.data[i].status, response.data[i].description,
                    response.data[i].publishDate, response.data[i].publishTime, response.data[i].organizerID,
                    response.data[i].picture));
            }

            if (response.error){
                return false;
            }else {
                return true;
            }
        });
    }

    //TODO: change local event to archived
    static archiveEvent(eventID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.get(axiosConfig.root + "/api/events/" + eventID + "/status/3", {headers: header}).then( response => {});
    }

    static publishEvent(eventID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.get(axiosConfig.root + "/api/events/" + eventID + "/status/2", {headers: header}).then( response => {});
    }

    static storeAllEventsForOrganizer(organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/events/organizer/" + organizerID, {headers: header}).then( response => {
            this.allEventsForOrganizer = [];
            for (let i = 0; i < response.data.length; i++) {
                this.allEvents.push(new Event(response.data[i].eventID, response.data[i].eventName,
                    response.data[i].startDate, response.data[i].endDate, response.data[i].startTime,
                    response.data[i].endTime, response.data[i].address, response.data[i].town,
                    response.data[i].zipCode, response.data[i].status, response.data[i].description,
                    response.data[i].publishDate, response.data[i].publishTime, response.data[i].organizerID,
                    response.data[i].picture));
            }
        });
    }
}