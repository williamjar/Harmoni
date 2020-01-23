import {CookieStore} from "./cookieStore";
import axios from "axios";

const axiosConfig = require("./axiosConfig");


export class ContactService {

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