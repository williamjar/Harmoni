import axios from "axios";
import {CookieStore} from './cookieStore';
const crypto = require('crypto');

export class LoginService {
    static loginOrganizer(email, enteredPassword, callback) {

        let hashedSaltedPassword = getHashedPassword(enteredPassword, email);


        let header = {
            "Content-Type": "application/json",
        };

        let body = {
            "email": email,
            "password": hashedSaltedPassword
        };

        return axios.post("http://localhost:8080/login", JSON.stringify(body), {headers: header})
            .then(res => {
                return res.data;
            })
            .then(loginResponse => {
                if (loginResponse.error) {
                    CookieStore.currentToken = null;
                    CookieStore.currentUserID = null;
                    console.log("Current token set to null");
                } else {
                    axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header})
                        .then(res => {
                            return res.data;
                        })
                        .then(emailResponse => {
                            if (!(loginResponse.error)) {
                                console.log("UserID and Token set");
                                CookieStore.currentUserID = emailResponse[0].organizerID;
                                CookieStore.currentToken = loginResponse.jwt;
                                //The user logs in
                                callback(loginResponse.status);
                            } else {
                                CookieStore.currentToken = null;
                                CookieStore.currentUserID = null;
                                console.log("Current token set to null");
                                //The user doesn't log in
                                callback(loginResponse.status);
                            }
                        });
                }
            }).catch(error => callback(500));
    }


}
/** Uses email to find the organizers organizerID */
function getOrganizerID(email, callback) {
    let header = {
        "Content-Type": "application/json",
    };
    return axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header})
        .then(res => {
            let organizerID = res.data[0].organizerID;
            callback(organizerID);
        })
}

/** Uses organizerID to find the organizers password */
function getPassword(organizerID, callback) {
    let header = {
        "Content-Type": "application/json",
    };
    return axios.get("http://localhost:8080/organizer/" + organizerID, {headers: header})
        .then(res => {
            let password = res.data[0].password;
            callback(password);
        })
}

/** Takes the entered password and hashes it with the salt from the database. */
function getHashedPassword(enteredPassword, email) {
    getOrganizerID(email, organizerID => {
        console.log(organizerID);
        getPassword(organizerID, passwordInDB => {
            console.log(passwordInDB);
            passwordInDB = passwordInDB.split("/");
            let salt = passwordInDB[0];

            function sha512(password, salt) {
                let hash = crypto.createHmac('sha512', salt);
                /** Hashing algorithm sha512 */
                hash.update(password);
                let value = hash.digest('hex');
                return salt + '/' + value;
            }

            let hashed = sha512(enteredPassword, salt);
            console.log(hashed);
            return hashed;
        })
    });
}
