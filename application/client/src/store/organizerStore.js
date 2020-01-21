import axios from "axios";
import {Organizer} from "../classes/organizer.js";
import {CookieStore} from "./cookieStore";
import {sha512} from "./hashService";
import {DocumentCategory} from "../classes/documentCategory";

const hash = require('./hashService');
const axiosConfig = require("./axiosConfig");

export class OrganizerStore {

    // organizerID, name, phone, email, username, pictureLink

    static currentOrganizer;

    static getOrganizer(organizerID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/organizer/' + organizerID, {headers: header})
            .then(response => {
                    this.currentOrganizer = new Organizer(response.data[0].organizerID, response.data[0].contactID, response.data[0].contactName, response.data[0].phone,
                        response.data[0].email, response.data[0].username, response.data[0].pictureLink);
                    console.log(this.currentOrganizer);
                    callback(200);
                }
            ).catch(err => callback(500));
    }

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
        return hash.verifyPassword(organizerID, oldPassword, rightPassword => {
            console.log("Right password " + rightPassword);
            if (rightPassword) {
                let newHashed = hash.sha512(newPassword, hash.generateSalt(16));
                console.log("newHashed = " + newHashed);

                let header = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                axios.put(axiosConfig.root + '/api/organizer/' + organizerID + '/change/password', {
                    "password": newHashed
                }, {headers: header}).catch(error => console.log(error));
                callback(200);
            } else {
                console.log("Password verification failed");
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
            console.log(res);
        });
    }

    static archiveOldEvents() {
        axios.put(axiosConfig.root + '/api/archive/' + this.currentOrganizer.organizerID).then(response => {
            if (response) {
                console.log(response.data.changedRows + " events moved to archive");
            }
        });
    }


}
