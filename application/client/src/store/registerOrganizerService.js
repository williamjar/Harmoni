import axios from 'axios';
const crypto = require('crypto');
const hash = require('./hashService');
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

        let hashedPassword = hash.sha512(password,hash.generateSalt(16));

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


