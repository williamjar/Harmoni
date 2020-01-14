import axios from 'axios';
import {CookieStore} from "./cookieStore";
const crypto = require('crypto');

const root = require('./axiosConfig').root;

export class RegisterOrganizerService {

    static registerOrganizer(username, email, password, callback) {
        let header = {
            "Content-Type": "application/json",
        };

        let contactBody = {
            "username": username,
            "phone": null,
            "email": email
        };

        let hashedPassword = saltHashPassword(password);

        axios.post('http://localhost:8080/contact', JSON.stringify(contactBody), {headers: header})
            .then(res => {
                return res.data.insertId;
            })
            .then(contactID => {
                axios.get("http://localhost:8080/organizer/username/" + username, {headers: header}).then(res => {
                    if (res.data.length === 0) {
                        axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(res => {
                            if (res.data.length === 0) {
                                let organizerBody = {
                                    "username": username,
                                    "password": hashedPassword,
                                    "contactID": contactID
                                };
                                return axios.post('http://localhost:8080/organizer', JSON.stringify(organizerBody), {headers: header}).then(res => {
                                    callback(200);
                                }).catch(() => callback(500));
                            }
                            callback(501);
                        }).catch(() => callback(500));
                    } else {
                        callback(502);
                    }
                }).catch(() => callback(500));
            }).catch(() => callback(500));
    }
}

function saltHashPassword(enteredPassword) {
    function genRandomString(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex').slice(0, length);
    }

    function sha512(password, salt) {
        let hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        let value = hash.digest('hex');
        return salt + '/' + value;
    }
    let salt = genRandomString(16);
    return sha512(enteredPassword, salt);
}

