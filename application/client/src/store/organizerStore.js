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
     * Updates the database with a new username for the
     * @param {int} organizerID - The database ID of the organizer.
     * @param {string} newUsername - The new username to be replace the current one.
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

    /**
     * Checks that the input password matches the one in database and if so update the database with a new password for the organizer.
     * @param {int} organizerID - The database ID of the organizer.
     * @param {string} oldPassword - The input password meant to match the password currently in the database.
     * @param {string} newPassword - The input password meant to replace the current password
     * @param {function} callback - The status code for the function.
     */
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

    /**
     * Updates the database with a new password for the organizer.
     * @param {string} newPhoneNumber - The new phone number to replace the current one.
     */
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


    /**
     * Deletes the current organizer from the database.
     * @return {Promise} - The promise received from the database.
     */
    static deleteCurrentOrganizer() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/contact/' + this.currentOrganizer.contactID, {headers: header}).then( res => {
            console.log("Deleted User");
        }).catch(e => console.log("Error deleting user - " + e));
    }
}
