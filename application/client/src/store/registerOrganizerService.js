import axios from 'axios';
import {CookieStore} from "./cookieStore";
const root = require('./axiosConfig').root;

export class RegisterOrganizerService{

    static registerOrganizer(username, email, password, callback){
        let header = {
            "Content-Type": "application/json",
        };

        let contactBody = {
            "username": username,
            "phone": null,
            "email": email
        };

        console.log("Creating contact at /contact with body " + contactBody);
        axios.post('http://localhost:8080/contact', JSON.stringify(contactBody), {headers: header})
            .then(res => {
                console.log("Return from inserting contact: " + res.data);
                return res.data.insertId;
            })
            .then(contactID => {
                axios.get("http://localhost:8080/organizer/username/" + username, {headers: header}).then(res => {
                    if (res.data.length === 0){
                        axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(res => {
                            if (res.data.length === 0){
                                let organizerBody = {
                                    "username": username,
                                    "password": password,
                                    "contactID": contactID
                                };
                                console.log(JSON.stringify(organizerBody));
                                return axios.post('http://localhost:8080/organizer', JSON.stringify(organizerBody), {headers: header}).then(res => {
                                    callback(200);
                                }).catch(() => callback(500));
                            }
                            callback(501);
                        }).catch(() => callback(500));
                    }
                    else{
                        callback(502);
                    }
                }).catch(() => callback(500));
            }).catch(() => callback(500));
    }

}