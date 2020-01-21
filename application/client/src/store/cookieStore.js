import axios from 'axios';
import {OrganizerStore} from "./organizerStore";

const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

export class CookieStore{

    static currentToken = null;
    static currentUserID = -1;

    static setCurrentToken(newToken){
        try{
            this.currentToken = newToken;
        }
        catch (e) {
            console.log(e);
        }
    }

    static setCurrentUserID(newID){
        this.currentUserID = newID;
    }

    static validateToken(callback){

        if (sessionStorage.getItem("loggedIn")){
            this.currentToken = sessionStorage.getItem("token");
            try{
                let email = jwt.decode(sessionStorage.getItem(('token')), publicKey).email;

                this.checkToken(email, statusCode => {
                    console.log("Token verified in CookieStore");
                    console.log(statusCode);
                    callback(statusCode === 200);
                });
            }
            catch (err) {
                console.log("Token not verified in CookieStore");
                callback(false);
            }
        }
        else{
            console.log("Token doesn't exist");
            callback(false);
        }
    }

    static checkToken(email, callback){
        let header = {
            'x-access-token': this.currentToken,
            'Content-Type': 'application/json'
        };

        let body = {
            'email': email
        };

        if (this.currentToken == null){
            return null;
        }

        return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.data).then(res => {
            console.log(res);
                if (res.error){
                    this.currentToken = null;
                    this.currentUserID = -1;
                    callback(500);
                }
                else{
                    sessionStorage.setItem("token", res.jwt);
                    this.currentToken = res.jwt;
                    console.log("Token set to " + this.currentToken);
                }
            }
        ).then(() => {
            if (this.currentToken != null){
                axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(response => response.data).then(IDResponse => {
                    if (IDResponse[0].organizerID){
                        this.currentUserID = IDResponse[0].organizerID;
                        callback(200);
                    }
                    else{
                        this.currentUserID = null;
                        callback(500);
                    }
                })
            }
            else{
                this.currentUserID = null;
                callback(500);
            }
        });
    }
}