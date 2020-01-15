import axios from "axios";
import {Organizer} from "../classes/organizer.js"
import {CookieStore} from "./cookieStore";
import {sha512} from "./hashService";

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
                    this.currentOrganizer = new Organizer(response.data[0].organizerID, response.data[0].contactName, response.data[0].phone,
                        response.data[0].email, response.data[0].username, response.data[0].pictureLink);
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

    static changePassword(organizerID, oldPassword, newPassword) {

        console.log("verify " + organizerID + " " + oldPassword);
        let passwordInDB = hash.getPassword(organizerID);
        let salt = hash.getSaltFromID(organizerID);
        let enteredPasswordHashed = sha512(oldPassword, salt);
        console.log(enteredPasswordHashed + " == " + passwordInDB);

        let correctPassword = (enteredPasswordHashed === passwordInDB);

        if (correctPassword) {

            let newHashed = hash.sha512(newPassword, hash.generateSalt(16));

            let header = {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            };

            return axios.put(axiosConfig.root + '/api/organizer/' + organizerID + '/change/password', {
                "password": newHashed
            }, {headers: header}).catch(error => console.log(error));
        } else {
            console.log("Password verification failed");
        }
    }

    static changePhoneNumber(newPhoneNumber) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let contactID = this.currentOrganizer.contactID;

        return axios.put(axiosConfig.root + '/api/contact/' + contactID + '/change/phonenumber', {
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

    getAllEvents(organizerId) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get(`/api/organizer/${organizerId}/events`, {headers: header});
    }


}
