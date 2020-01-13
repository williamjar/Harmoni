import axios from "axios";
import Event from "../classes/event.js";
import {CookieStore} from "../cookies_client/cookieStore.js";
import {forEach} from "react-bootstrap/esm/ElementChildren";

let axiosConfig = require("./axiosConfig");

class eventStore{

    static currentEvent = null;

    static allEvents = [];

    static storeCurrentEvent(eventID){

        //Populates currentEvent

        let header = {
            "Content-Type": "application/json"
        };

        return axios.get(axiosConfig.root + "/login", {headers: header}).then(response => {
            this.currentEvent = new Event(response.data.eventID, response.data.eventName,
                response.data.startDate, response.data.endDate, response.data.startTime,
                response.data.endTime, response.data.address, response.data.town,
                response.data.zipCode, response.data.status, response.data.description,
                response.data.publishDate, response.data.publishTime, response.data.organizerID,
                response.data.picture);
        });
    }

    static postCurrentEvent(){

        let header = {};

        let body = {
            firstnme : ""
        };

        return axios.post(axiosConfig.root + "")
    }

    static storeAllEvents(){

        let header = {
            "Content-Type": "application/json"
        };

        return axios.get(axiosConfig.root + "/api/events", {headers: header}).then( response => {
            this.allEvents = null;
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

    //TODO: change local event to archived
    static archiveEvent(eventID){

        let header = {
            "Content-Type": "application/json"
        };

        return axios.get(axiosConfig.root + "/api/events/" + eventID + "/status/3", {headers: header}).then( response => {});
    }

    static publishEvent(eventID){

        let header = {
            "Content-Type": "application/json"
        };

        return axios.get(axiosConfig.root + "/api/events/" + eventID + "/status/2", {headers: header}).then( response => {});
    }
}