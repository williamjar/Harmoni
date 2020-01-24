import axios from 'axios';
import {hashService} from "./hashService";

const root = require('./axiosConfig').root;

/**
 * @class RegisterOrganizerService
 * @classdesc Service class for functions related to registering a new user.
 */
export class RegisterOrganizerService {

    /**
     * Checks if desired username and email is available if so registers the new user into the database.
     * @param {string} username - The database ID of the organizer.
     * @param {string} phone - Desired phone number.
     * @param {string} email - Desired email
     * @param {string} password - Desired password.
     * @param {function} callback - Returns status on how the registration went.
     */
    static registerOrganizer(username, phone, email, password, callback) {
        let header = {
            "Content-Type": "application/json",
        };

        let contactBody = {
            "username": username,
            "phone": phone,
            "email": email
        };

        let hashedPassword = hashService.sha512(password, hashService.generateSalt(16));

        axios.post('http://localhost:8080/contact', JSON.stringify(contactBody), {headers: header})
            .then(res => {
                return res.data.insertId;
            })
            .then(contactID => {
                console.log("Contact registered: " + contactID);
                axios.get("http://localhost:8080/organizer/username/" + username, {headers: header}).then(res => {
                    if (res.data.length === 0) {
                        axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(res => {
                            console.log("Registering an organizer with hash " + hashedPassword);
                            if (res.data.length === 0) {
                                let organizerBody = {
                                    "username": username,
                                    "password": hashedPassword,
                                    "contactID": contactID
                                };
                                return axios.post('http://localhost:8080/organizer', JSON.stringify(organizerBody), {headers: header}).then(res => {
                                    console.log("Organizer posted");
                                    callback(200);
                                }).catch(err => callback(500, err));
                            }
                            callback(501);
                        }).catch(err => callback(500, err));
                    } else {
                        callback(502, {error: "Username does exist when it shouldn't"});
                    }
                }).catch(err => callback(500, err));
            }).catch(err => callback(500, err));
    }
}


