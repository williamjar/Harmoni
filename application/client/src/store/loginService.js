import axios from "axios";
import {CookieStore} from "./cookieStore";

const axiosConfig = require('./axiosConfig');

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

                return axios.post(axiosConfig.root + "/login", JSON.stringify(body), {headers: header})
                    .then(res => {
                        return res.data;
                    })
                    .then(loginResponse => {
                        if (loginResponse.error) {
                            CookieStore.setCurrentToken(null);
                            CookieStore.setCurrentUserID(-1);
                            console.log("Current token set to null");
                            callback(501);
                        } else {
                            axios.get(axiosConfig.root + "/organizer/by-email/" + email, {headers: header})
                                .then(res => {
                                    return res.data;
                                })
                                .then(emailResponse => {
                                    if (!(loginResponse.error && loginResponse.data.length > 0)) {
                                        console.log("UserID and Token set");
                                        CookieStore.setCurrentUserID(emailResponse[0].organizerID);
                                        CookieStore.setCurrentToken(loginResponse.jwt);
                                        //The user logs in
                                        callback(200);
                                    } else {
                                        CookieStore.setCurrentToken(null);
                                        CookieStore.setCurrentUserID(-1);
                                        console.log("Current token set to null");
                                        //The user doesn't log in
                                        callback(500);
                                    }
                                })
                        }
                    }).catch(error => callback(501));
            }
        });
    }
}

