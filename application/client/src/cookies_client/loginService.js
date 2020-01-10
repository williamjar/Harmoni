import axios from "axios";
import {CookieStore} from './cookieStore';

export class LoginService{
    static loginOrganizer(email, hashedSaltedPassword, callback){

        let header = {
            "Content-Type": "application/json"
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
                console.log(loginResponse);
                if (loginResponse.error){
                    CookieStore.currentToken = null;
                    CookieStore.currentUserID = null;
                }
                else{
                    console.log("before getting id");
                    axios.get("http://localhost:8080/organizer/by-email/" + email)
                        .then(res => {
                            console.log("transforming to .data");
                            return res.data;
                        })
                        .then(emailResponse => {
                            console.log(emailResponse);
                            if (!(loginResponse.error)){
                                console.log("UserID and Token set");
                                CookieStore.currentUserID = emailResponse.organizerID;
                                CookieStore.currentToken = loginResponse.jwt;
                                //The user logs in
                                callback();
                            }
                            else{
                                CookieStore.currentToken = null;
                                CookieStore.currentUserID = null;
                                //The user doesn't log in
                                callback();
                            }
                        });
                }
            });
    }
}