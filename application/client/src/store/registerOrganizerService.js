import axios from 'axios';
import {hashService} from "./hashService";
const axiosConfig = require('./axiosConfig');

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

        axios.post(axiosConfig.root + '/contact', JSON.stringify(contactBody), {headers: header})
            .then(res => {
                return res.data.insertId;
            })
            .then(contactID => {
                axios.get(axiosConfig.root + "/organizer/username/" + username, {headers: header}).then(res => {
                    if (res.data.length === 0) {
                        axios.get(axiosConfig.root + "/organizer/by-email/" + email, {headers: header}).then(res => {
                            if (res.data.length === 0) {
                                let organizerBody = {
                                    "username": username,
                                    "password": hashedPassword,
                                    "contactID": contactID
                                };
                                return axios.post(axiosConfig.root + '/organizer', JSON.stringify(organizerBody), {headers: header}).then(res => {
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


