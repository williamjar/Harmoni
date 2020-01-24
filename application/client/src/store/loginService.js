import axios from "axios";
import {CookieStore} from "./cookieStore";
import {hashService} from "./hashService";

/**
 * @class LoginService
 * @classdesc Service class for logging in a user.
 */
export class LoginService {

    /**
     * Checks if the entered password matches the password stored in the database for the entered email.
     * If the password matches the user is logged in to the system.
     * @param {string} email - Email to check against database.
     * @param {string} enteredPassword - Password to check against database.
     * @param {function} callback
     */
    static loginOrganizer(email, enteredPassword, callback) {
        hashService.getHashedFromEmail(enteredPassword, email, hashedPassword => {
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
                            CookieStore.setCurrentToken(null);
                            CookieStore.setCurrentUserID(-1);
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

