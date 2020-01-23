import {CookieStore} from "./cookieStore";
import axios from "axios";

const axiosConfig = require("./axiosConfig");

export class ContactService {

    /**
     * Updates a contact in the database with new information.
     * @param {int} contactID - The database ID of the contact.
     * @param {String} contactName - The full name of the contact.
     * @param {String} phone - The phone number of the contact.
     * @param {String} email - The email the contact.
     * @param {function} callback
     */
    static updateContactInfo(contactID, contactName, phone, email, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let body = {
            "contactName" : contactName,
            "phone" : phone,
            "email" : email,
        };

        axios.put(axiosConfig.root +"/api/contact/" + contactID, body, {headers: header}).then(response => {
            callback();
        })
    }
}