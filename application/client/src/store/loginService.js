import axios from "axios";
import {CookieStore} from './cookieStore';

export class LoginService{
    static loginOrganizer(email, hashedSaltedPassword, callback){

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
                if (loginResponse.error){
                    CookieStore.currentToken = null;
                    CookieStore.currentUserID = null;
                    console.log("Current token set to null");
                    callback(501);
                }
                else{
                    axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header})
                        .then(res => {
                            return res.data;
                        })
                        .then(emailResponse => {
                            if (!(loginResponse.error && loginResponse.data.length > 0)){
                                console.log("UserID and Token set");
                                CookieStore.currentUserID = emailResponse[0].organizerID;
                                CookieStore.currentToken = loginResponse.jwt;
                                //The user logs in
                                callback(200);
                            }
                            else{
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
}