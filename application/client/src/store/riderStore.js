import axios from "axios";
import {RiderElement} from "../classes/riderElement"
import {CookieStore} from "./cookieStore";

const axiosConfig = require("./axiosConfig");

/**
 * @class RiderStore
 * @classdesc Store class for functions related to accessing and modifying riders.
 */
export class RiderStore {
    static allRidersForCurrentEvent = [];

    static addToAllRidersForCurrentArtistAndEvent(rider) {
        this.allRidersForCurrentEvent.push(rider);
    }


    /**
     * Fills the allRidersForCurrentEvent variable with rider objects belonging to a specific event via data from the database.
     * @param {function} callback
     * @param {int} eventID - The database ID of the event.
     */
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
                        data.status, (data.isDone === 1), data.description)
                ));
                callback();
            })
            .catch(error => console.log(error));
    }


    /**
     * Creates a new rider element and inserts it into the database.
     * The created rider element is returned in the callback as a rider element object.
     * @param {function} callback
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {string} description - A description of the rider element.
     */
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

    /**
     * Creates a new rider element and inserts it into the database.
     * The created rider element is returned in the callback as a rider element object.
     * @param {string} artistToken - The access token to be modify database.
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {string} description - A description of the rider element.
     * @param {function} callback
     */
    static createNewRiderElementFromArtistLogin(artistToken, artistID, eventID, description, callback) {
        const header = {
            "Content-Type": "application/json",
            "x-access-token": artistToken
        };
        const data = {
            artistID: artistID,
            eventID: eventID,
            description: description
        };
        axios.post(axiosConfig.root + "/artistapi/rider", JSON.stringify(data), {headers: header}).then(response => {
            callback(200, new RiderElement(response.data.insertId, artistID, "", false, description));
        }).catch(() => callback(500));
    }

    /**
     * Changes the data of a specific rider in the database.
     * @param {function} callback
     * @param {string} riderElementID - The access token to be modify database.
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {string} status - A note on how the rider is going.
     * @param {int} isDone - (True/False) Is the rider element complete or not.
     * @param {string} description - A description of the rider element.
     */
    static updateRider(callback, riderElementID, artistID, eventID, status, isDone, description) {

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

    /**
     * Deletes a specific rider in the database.
     * @param {function} callback
     * @param {int} eventID - The database ID of the event.
     * @param {int} artistID - The database ID of the artist.
     * @param {string} riderID - The database ID of the rider.
     */
    static deleteRider(callback, eventID, artistID, riderID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.delete(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderID, {headers: header}).then(callback()).catch(error => console.log(error));
    }

    /**
     * Deletes a rider from the database via the specific artist API.
     * @param {int} artistToken -
     * @param {int} eventID - The database ID of the event.
     * @param {int} artistID - The database ID of the artist.
     * @param {string} riderID - The database ID of the rider.
     * @param {function} callback
     */
    static deleteRiderFromArtistPage(artistToken, eventID, artistID, riderID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": artistToken
        };
        axios.delete(axiosConfig.root + "/artistapi/rider/" + eventID + "/" + artistID + "/" + riderID, {headers: header})
            .then(response => {
                callback(response.status, response.data);
            })
    }

    /**
     * Changes the data of a specific rider in the database.
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {string} token - The access token to be modify database.
     * @param {function} callback
     */
    static getAllRidersForArtistByEvent(artistID, eventID, token, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": token
        };
        axios.get(axiosConfig.root + "/artistapi/event/" + eventID + "/artist/" + artistID + "/rider", {headers: header}).then(response => {
            if (response.data && response.data.length > 0) {
                callback(200, response.data.map(riderElement => new RiderElement(riderElement.riderElementID, artistID, riderElement.status, riderElement.isDone, riderElement.description)));
            } else {
                callback(500);
            }
        })
    }
}


