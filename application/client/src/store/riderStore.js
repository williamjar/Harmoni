import axios from "axios";

import {RiderElement} from "../classes/riderElement"
import {CookieStore} from "./cookieStore";


const axiosConfig = require("./axiosConfig");

export class RiderStore {
    static allRidersForCurrentEvent = [];

    static addToAllRidersForCurrentArtistAndEvent(rider){
        this.allRidersForCurrentEvent.push(rider);
    }

    //get a rider element
    static getRider(riderID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.get(axiosConfig.root + '/api/rider/' + riderID, {headers: header})
            .then(response => {
                    return new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description);
                }
            )
            .catch(error => console.log(error));
    }

    //get all riders for an event
    static storeAllRidersForEvent(callback, eventID) {
        this.allRidersForCurrentEvent = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/rider', {headers: header})
            .then(response => {

                this.allRidersForCurrentEvent = response.data.map(data => (
                    new RiderElement(data.riderElementID, data.artistID,
                        data.status, data.isDone === 1, data.description)
                ));

                callback();

            })
            .catch(error => console.log(error));
    }


    //create a new rider element.
    static createNewRiderElement(callback, artistID, eventID, description) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/rider', {
            artistID: artistID,
            eventID: eventID,
            description: description
        }, {headers: header}).then(response => {
            callback(new RiderElement(response.data.insertId, artistID, "", false, description));
        }).catch(error => console.log(error));
    }

    //Only for the artists own use
    static createNewRiderElementFromArtistLogin(artistToken, artistID, eventID, description, callback){
        const header = {
            "Content-Type": "application/json",
            "x-access-token": artistToken
        };
        const data = {
            artistID: artistID,
            eventID: eventID,
            description: description
        };
        axios.post(axiosConfig.root + "/artistapi/rider", JSON.stringify(data), {headers: header}).then( response => {
            callback(200, new RiderElement(response.data.insertId, artistID, "", false, description));
        }).catch(() => callback(500));
    }

    //update a rider element
    static updateRider(callback, riderElementID, artistID, eventID, status, isDone, description) {
        console.log("From rider store: " + riderElementID + artistID + eventID + status + isDone + description);

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.put(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderElementID, {
            riderElementID: riderElementID,
            artistID: artistID,
            eventID: eventID,
            status: status,
            isDone: isDone,
            description: description
        }, {headers: header}).then(response => {
            callback();
        }).catch(error => console.log(error));
    }

    //delete a rider element
    static deleteRider(callback, eventID, artistID, riderID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.delete(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderID, {headers: header}).then(callback()).catch(error => console.log(error));
    }

    //Delete a rider element for the artist
    static deleteRiderFromArtistPage(artistToken, eventID, artistID, riderID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": artistToken
        };
        axios.delete(axiosConfig.root +  "/artistapi/rider/" + eventID + "/" + artistID + "/" + riderID, {headers: header})
            .then(response => {
                callback(response.status, response.data);
            })
    }

    static getAllRidersForArtistByEvent(artistID, eventID, token, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": token
        };
        axios.get(axiosConfig.root + "/artistapi/event/" + eventID + "/artist/" + artistID + "/rider", {headers: header}).then(response => {
            if(response.data && response.data.length > 0){
                callback(200, response.data.map(riderElement => new RiderElement(riderElement.riderElementID, artistID, riderElement.status, riderElement.isDone, riderElement.description)));
            }
            else{
                callback(500);
            }
        })
    }
}


