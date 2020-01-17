import axios from "axios";
import {CookieStore} from './cookieStore';

const hash = require('./hashService');

export class LoginService {

    static loginOrganizer(email, enteredPassword, callback) {

        hash.getHashedFromEmail(enteredPassword, email, hashedPassword => {
            if (!hashedPassword) {
                console.log("Email does not exist");
                callback(502);
            } else {
                let header = {
                    "Content-Type": "application/json",
                };

                let body = {
                    "email": email,
                    "password": hashedPassword
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
                            callback(501);
                        } else {
                            axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header})
                                .then(res => {
                                    return res.data;
                                })
                                .then(emailResponse => {
                                    if (!(loginResponse.error && loginResponse.data.length > 0)) {
                                        console.log("UserID and Token set");
                                        CookieStore.currentUserID = emailResponse[0].organizerID;
                                        CookieStore.currentToken = loginResponse.jwt;
                                        //The user logs in
                                        callback(200);
                                    } else {
                                        CookieStore.currentToken = null;
                                        CookieStore.currentUserID = null;
                                        console.log("Current token set to null");
                                        //The user doesn't log in
                                        callback(500);
                                    }
                                });
                        }
                    }).catch(error => callback(501));
            }
        });
    }
}

