import axios from "axios";
import {Organizer} from "../classes/organizer.js"
import {CookieStore} from "./cookieStore";

const axiosConfig = require("./axiosConfig");

export class OrganizerStore {

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

    // organizerID, name, phone, email, username, pictureLink

    static changeUsername(organizerID, newUsername) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };


        return axios.put(axiosConfig.root + `/api/organizer/${organizerID}/change/username`, {
            username : newUsername,
        }, {headers: header});
    }


    static changePassword(organizerID, oldPassword, newPassword) {
        //TODO: Add check for old password to see if password change is allowed

        let json = {
            'password': newPassword
        };
        return axios.put(`/api/organizer/${organizerID}`, json);
    }

    changePhoneNumber() {

    }

    changeUserImage() {

    }


    getAllEvents(organizerId) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get(`/api/organizer/${organizerId}/events`, {headers: header});
    }


}
