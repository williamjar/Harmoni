import axios from "axios";
import {CookieStore} from './cookieStore';

export class LoginService {

    static loginOrganizer(email, enteredPassword, callback) {

        let header = {
            "Content-Type": "application/json",
        };

        let body = {
            "email": email,
            "password": enteredPassword
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

    /** Uses email to find the organizers organizerID */
    static getOrganizerID(email, callback) {
        let header = {
            "Content-Type": "application/json",
        };
        return axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header})
            .then(res => {
                let organizerID = res.data[0].organizerID;
                console.log("1. OrganizerID = " + organizerID);
                callback(organizerID);
            });
    }

    /** Uses organizerID to find the organizers password */
    static getPassword(organizerID, callback) {
        console.log('OrganizerID: ' + organizerID);
        let header = {
            "Content-Type": "application/json",
        };
        return axios.get("http://localhost:8080/organizer/" + organizerID, {headers: header})
            .then(res => {
                let password = res.data[0].password;
                callback(password);
            });
    }
}

