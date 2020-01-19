import axios from "axios";

import {RiderElement} from "../classes/riderElement"
import {CookieStorage} from "../cookieStorage";

const axiosConfig = require("./axiosConfig");

export class RiderStore {
    static allRidersForCurrentEvent = [];
    static allRidersForCurrentArtistAndEvent = [];

    //get a rider element
    static getRider(riderID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };

        axios.get(axiosConfig.root + '/api/rider/' + riderID, {headers: header})
            .then(response => {
                    return new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description);
                }
            )
            .catch(error => console.log(error));
    }

    //get all rider elements for an artist
    static getAllRiderElementsFromArtist(artistID) {
        let allRiderElementsFromArtist = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/' + artistID + '/rider', {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allRiderElementsFromArtist.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description));
                }
            }
        )
            .catch(error => console.log(error));
        return allRiderElementsFromArtist;
    }

    //get all rider elements for an artist for an event
    static getAllRiderElementsFromArtistAndEvent(eventID, artistID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider', {headers: header})
            .then(response => {
                    for (let i = 0; i < response.data.length; i++) {
                        this.allRidersForCurrentArtistAndEvent.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                            response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                            response.data[0].description));
                    }
                }
            )
            .catch(error => console.log(error));
    }

    //get all riders for an event
    static storeAllRidersForEvent(eventID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/rider', {headers: header})
            .then(response => {
                this.allRidersForCurrentEvent = [];
                for (let i = 0; i < response.data.length; i++) {
                    this.allRidersForCurrentEvent.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description))
                }
            })
            .catch(error => console.log(error));
    }


    //create a new rider element.
    static createNewRiderElement(callback, artistID, eventID, description) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };

        axios.post(axiosConfig.root + '/api/rider', {
            artistID: artistID,
            eventID: eventID,
            description: description
        }, {headers: header}).then(response => {
            callback(new RiderElement(response.data.insertId, artistID, "", false, description));
        }).catch(error => console.log(error));
    }

    //update a rider element
    static updateRider(riderElementID, artistID, eventID, status, isDone, description) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };
        axios.put(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderElementID, {
            riderElementID: riderElementID,
            artistID: artistID,
            eventID: eventID,
            status: status,
            isDone: isDone,
            description: description
        }, {headers: header})
            .catch(error => console.log(error));
    }

    //delete a rider element
    static deleteRider(eventID, artistID, riderID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
        };
        axios.delete(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderID, {headers: header})
            .catch(error => console.log(error));
    }
}


