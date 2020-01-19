import axios from 'axios';
import {CookieStorage} from '../cookieStorage';
const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

export class CookieStore{
    static currentUserID = -1;

    static validateToken(){

        if (CookieStorage.currentToken == null || this.currentUserID === -1){
            console.log("Token doesn't exist");
            return false;
        }
        else{
            try{
                jwt.verify(CookieStorage.currentToken, publicKey);
                console.log("Token verified in CookieStore");
                return true;
            }
            catch (err) {
                console.log("Token not verified in CookieStore");
                return false;
            }
        }

    }

    static checkToken(email){
        let header = {
            'x-access-token': CookieStorage.currentToken,
            'Content-Type': 'application/json'
        };

        let body = {
            'email': email
        };

        if (CookieStorage.currentToken == null){
            return null;
        }

        return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.json).then(res => {
                if (res.error){
                    CookieStorage.currentToken = null;
                    this.currentUserID = null;
                }
                else{
                    CookieStorage.currentToken = res.jwt;
                    console.log("Token set to " + this.currentToken);
                }
            }
        ).then(() => {
            if (CookieStorage.currentToken != null){
                axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(response => response.json).then(IDResponse => {
                    if (IDResponse.status === 200 && IDResponse.organizerID){
                        this.currentUserID = IDResponse.organizerID;
                    }
                    else{
                        this.currentUserID = null;
                    }
                })
            }
            else{
                this.currentUserID = null;
            }
        }).catch(error => {
            console.log('Error: ' + error.error);
        });
    }
}