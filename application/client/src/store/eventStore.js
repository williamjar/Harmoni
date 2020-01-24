import axios from "axios";
import {Event} from "../classes/event.js";
import {CookieStore} from "./cookieStore";
import {OrganizerStore} from "./organizerStore";

let axiosConfig = require("./axiosConfig");


/**
 * @class EventStore
 * @classdesc Store Class for functions related to accessing and modifying event objects.
 */
export class EventStore {

    static currentEvent = null;
    static allEvents = [];
    static allEventsForOrganizer = [];
    static eventCategories = [];

    /**
     * Setter for currentEvent variable
     * @param {Event} newEvent - The event currentEvent will be set to.
     */
    static setCurrentEvent(newEvent) {
        this.currentEvent = newEvent;
        sessionStorage.setItem('currentEvent', JSON.stringify(this.currentEvent));
    }

    /**
     * Creates a new event in the database and sets it to be currentEvent.
     * @param {function} callback
     * @param {String} eventName - The name of the event.
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static createEvent(callback, eventName, organizerID) {

        let d = new Date();
        let today = this.formatDate(d);
        let startTime = this.formatTime(d);
        let endTime = this.formatTime(d.setHours(d.getHours() + 1));

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        // ^ Unsure if callback is needed for this method ^
        //Call to create an event

        let body = {
            "eventName": eventName,
            "startDate": today,
            "endDate": today,
            "startTime": startTime,
            "endTime": endTime,
            "address": "",
            "town": "",
            "zipCode": null,
            "status": 0,
            "description": "",
            "publishDate": null,
            "publishTime": null,
            "organizerID": organizerID,
            "eventTypeID": 1,
            "pictureID": null
        };

        axios.post(axiosConfig.root + "/api/events", body, {headers: header}).then(response => {
            //Create an event from the insertID returned from the query and the organizerID, the rest is null
            this.currentEvent = new Event(response.data.insertId, eventName, today, today, startTime, endTime, null, null, null, 0, null, null, null, organizerID, 1, null);
            callback();
        }).catch(console.log("Error in eventStore"));
    }

    /**
     * TODO Delete or change?
     */
    static storeCurrentEvent(eventID, callback) {

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
                response.data[0].eventType, response.data[0].pictureID);
        }).then(() => callback());
    }

    /**
     * Sends the data of the current event to update that event in the database. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static editCurrentEvent() {

        console.log("Edit Current event: " + this.currentEvent.toString());
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let body = {
            "eventID": this.currentEvent.eventID,
            "eventName": this.currentEvent.eventName,
            "startDate": this.currentEvent.startDate,
            "endDate": this.currentEvent.endDate,
            "startTime": this.currentEvent.startTime,
            "endTime": this.currentEvent.endTime,
            "address": this.currentEvent.address,
            "town": this.currentEvent.town,
            "zipCode": this.currentEvent.zipCode,
            "status": this.currentEvent.status,
            "description": this.currentEvent.description,
            "publishDate": this.currentEvent.publishDate,
            "publishTime": this.currentEvent.publishTime,
            "organizerID": this.currentEvent.organizer,
            "eventTypeID": this.currentEvent.eventType,
            "pictureID": this.currentEvent.picture
        };
        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID, body, {headers: header});
    }

    /**
     * TODO - Delete?
     */
    static storeAllEvents() {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/events", {headers: header}).then(response => {
            this.allEvents = null;
            for (let i = 0; i < response.data.length; i++) {
                this.allEvents.push(new Event(response.data[i].eventID, response.data[i].eventName,
                    response.data[i].startDate, response.data[i].endDate, response.data[i].startTime,
                    response.data[i].endTime, response.data[i].address, response.data[i].town,
                    response.data[i].zipCode, response.data[i].status, response.data[i].description,
                    response.data[i].publishDate, response.data[i].publishTime, response.data[i].organizerID,
                    response.data[i].eventTypeID, response.data[i].picture));
            }

            if (response.error) {
                return false;
            } else {
                return true;
            }
        });
    }

    /**
     * Removes the current event from the database. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static deleteCurrentEvent() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + "/api/events/" + this.currentEvent.eventID, {headers: header});
    }

    /**
     * Changes the database data of the current event to set it to published. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static publishCurrentEvent() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID + "/status/1", null,{headers: header}).then(response => {
            console.log(response);
        });
    }

    /**
     * Changes the database data of the current event to set it to cancelled. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static cancelCurrentEvent() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID + "/status/3", null,{headers: header}).then(response => {
        });
    }

    /**
     * Changes the database data of the current event to set it to under planning. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static planCurrentEvent() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.put(axiosConfig.root + "/api/events/" + this.currentEvent.eventID + "/status/0", {headers: header}).then(response => {
        });
    }

    /**
     * Changes the database data of the current event to set it to under planning. Current event is defined by the currentEvent variable.
     * @return {Promise} The promise received from the database.
     */
    static archiveOldEvents() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.put(axiosConfig.root + '/api/archive/' + OrganizerStore.currentOrganizer.organizerID,null,{headers: header});
    }

    static storeAllEventsForOrganizer(callback, organizerID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/events/organizer/" + organizerID, {headers: header}).then(response => {
            this.allEventsForOrganizer = [];

            console.log("EventStore: data length: " + response.data.length);

            for (let i = 0; i < response.data.length; i++) {
                this.allEventsForOrganizer.push(new Event(response.data[i].eventID, response.data[i].eventName,
                    response.data[i].startDate, response.data[i].endDate, response.data[i].startTime,
                    response.data[i].endTime, response.data[i].address, response.data[i].town,
                    response.data[i].zipCode, response.data[i].status, response.data[i].description,
                    response.data[i].publishDate, response.data[i].publishTime, response.data[i].organizerID,
                    response.data[i].eventTypeID, response.data[i].pictureID));
            }
            callback();
        });
    }

    static getEventCategories(callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/event-type", {headers: header}).then(response => {
            this.eventCategories = [];
            for (let i = 0; i < response.data.length; i++) {
                this.eventCategories.push(response.data[i].eventTypeName);
            }
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
        return [hours, mins].join(':');
    }
}