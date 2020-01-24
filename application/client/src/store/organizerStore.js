import axios from "axios";
import {Organizer} from "../classes/organizer.js";
import {CookieStore} from "./cookieStore";
import {hashService} from "./hashService";
const axiosConfig = require("./axiosConfig");

/**
 * @class OrganizerStore
 * @classdesc Store class for functions related to accessing and modifying organizer objects and the logged in user.
 */
export class OrganizerStore {

    static currentOrganizer;

    /**
     * Sets the variable currentOrganizer to a Organizer object matching the data from database.
     * @param {int} organizerID - The database ID of the organizer.
     * @param {function} callback
     */
    static getOrganizer(organizerID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/organizer/' + organizerID, {headers: header})
            .then(response => {
                    this.currentOrganizer = new Organizer(response.data[0].organizerID, response.data[0].contactID, response.data[0].contactName, response.data[0].phone,
                        response.data[0].email, response.data[0].username, response.data[0].pictureLink);
                    callback(200);
                }
            ).catch(err => callback(500));
    }

    /**
     * TODO Not used delete?
     */
    static updateProfilePicture(pictureID, pictureLink){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/organizer/picture/' + pictureID + '/' + pictureLink, {
        }, {headers: header})
            .catch(error => console.log(error));
    }

    /**
     * Updates the database with a new username for the
     * @param {int} organizerID - The database ID of the organizer.
     * @param {String} newUsername - The new username username of
     * @param {function} callback
     */
    static changeUsername(organizerID, newUsername) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/organizer/' + organizerID + '/change/username', {
            username: newUsername,
        }, {headers: header}).catch(error => console.log(error));
    }

    static changePassword(organizerID, oldPassword, newPassword, callback) {
        return hashService.verifyPassword(organizerID, oldPassword, rightPassword => {
            if (rightPassword) {
                let newHashed = hashService.sha512(newPassword, hashService.generateSalt(16));

                let header = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                axios.put(axiosConfig.root + '/api/organizer/' + organizerID + '/change/password', {
                    "password": newHashed
                }, {headers: header}).catch(error => console.log(error));
                callback(200);
            } else {
                callback(500);
            }
        });
    }

    static changePhoneNumber(newPhoneNumber) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let currentUserID = CookieStore.currentUserID;

        return axios.put(axiosConfig.root + '/api/contact/' + currentUserID + '/change/phonenumber', {
            "phone": newPhoneNumber
        }, {headers: header}).catch(error => console.log(error));
    }

    static changeUserImage(pictureLink) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.put(axiosConfig.root + '/api/picture/insert/', {
            pictureLink: pictureLink
        }, {headers: header}).then(res => {
            let pictureID = res.data[0].insertId;
            return axios.put(axiosConfig.root + '/api/organizer/' + this.currentOrganizer.organizerID + '/change/picture', {
                "pictureID": pictureID
            }, {headers: header});
        }).catch(error => console.log(error));
    }

    static getAllEvents(organizerId) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get(`/organizer/${organizerId}/events`, {headers: header});
    }

    static deleteCurrentOrganizer() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        console.log("CONTACT ID " + this.currentOrganizer.contactID);
        return axios.delete(axiosConfig.root + '/api/contact/' + this.currentOrganizer.contactID, {headers: header}).then( res => {
            console.log("Deleted User: " + res);
        }).catch(e => console.log("Error deleting user - " + e));
    }
}
