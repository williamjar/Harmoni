import axios from "axios";
import {Event} from "../classes/event.js";
import {CookieStore} from "../store/cookieStore.js";
import {forEach} from "react-bootstrap/esm/ElementChildren";

let axiosConfig = require("./axiosConfig");

export class EventStore{

    static currentEvent = null;

    static allEvents = [];

    static allEventsForOrganizer = [];

    static createEvent(callback, eventName, organizerID){

        let d = new Date();
        let today = this.formatDate(d);
        let startTime = this.formatTime(d);
        let endTime = this.formatTime(d.setHours(d.getHours()+1));

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        // ^ Unsure if callback is needed for this method ^
        //Call to create an event

        let body = {
            "eventName" : eventName,
            "startDate" : today,
            "endDate" : today,
            "startTime" : startTime,
            "endTime" : endTime,
            "address" : null,
            "town" : null,
            "zipCode" : null,
            "status" : 1,
            "description" : null,
            "publishDate" : null,
            "publishTime" : null,
            "organizerID" : organizerID,
            "pictureID" : null
        };

        axios.post(axiosConfig.root + "/api/events" , body, {headers: header}).then(response =>{
            //Create an event from the insertID returned from the query and the organizerID, the rest is null
            this.currentEvent = new Event(response.data.insertId, eventName, today, today, startTime, endTime, null, null, null, 0, null, null, null, organizerID, null);
            callback();
        }).catch(console.log("Error in eventStore"));
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
            "eventID" : this.currentEvent.eventID,
            "eventName" : this.currentEvent.eventName,
            "startDate" : this.currentEvent.startDate,
            "endDate" : this.currentEvent.endDate,
            "startTime" : this.currentEvent.startTime,
            "endTime" : this.currentEvent.endTime,
            "address" : this.currentEvent.address,
            "town" : this.currentEvent.town,
            "zipCode" : this.currentEvent.zipCode,
            "status" : this.currentEvent.status,
            "description" : this.currentEvent.description,
            "publishDate" : this.currentEvent.publishDate,
            "publishTime" : this.currentEvent.publishTime,
            "organizerID" : this.currentEvent.organizer,
            "pictureID" : this.currentEvent.picture
        };

        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID, body, {headers: header});
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

    static deleteCurrentEvent() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + "/api/events/" + this.currentEvent.eventID, {headers: header});
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

    static storeAllEventsForOrganizer(callback, organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/events/organizer/" + organizerID, {headers: header}).then( response => {
            this.allEventsForOrganizer = [];

            console.log("EventStore: data length: " + response.data.length);

            for (let i = 0; i < response.data.length; i++) {
                this.allEventsForOrganizer.push(new Event(response.data[i].eventID, response.data[i].eventName,
                    response.data[i].startDate, response.data[i].endDate, response.data[i].startTime,
                    response.data[i].endTime, response.data[i].address, response.data[i].town,
                    response.data[i].zipCode, response.data[i].status, response.data[i].description,
                    response.data[i].publishDate, response.data[i].publishTime, response.data[i].organizerID,
                    response.data[i].picture));
            }

            console.log("EventStore: allEventsForOrganizer: " + this.allEventsForOrganizer);

            callback();
        });
    }

    static formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [year, month, day].join('-');
    }

    static formatTime(date) {
        let d = new Date(date),
            hours = '' + (d.getHours()),
            mins = '' + d.getMinutes();
        return [hours,mins].join(':');
    }
}