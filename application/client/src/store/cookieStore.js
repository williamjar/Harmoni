import axios from 'axios';

const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

export class CookieStore{

    static currentToken = null;
    static currentUserID = -1;

    static setCurrentToken(newToken){
        this.currentToken = newToken;
    }

    static setCurrentUserID(newID){
        this.currentUserID = newID;
    }

    static validateToken(){

        if (this.currentToken == null || this.currentUserID === -1){
            console.log("Token doesn't exist");
            return false;
        }
        else{
            try{
                jwt.verify(this.currentToken, publicKey);
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
            'x-access-token': this.currentToken,
            'Content-Type': 'application/json'
        };

        let body = {
            'email': email
        };

        if (this.currentToken == null){
            return null;
        }

        return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.json).then(res => {
                if (res.error){
                    this.currentToken = null;
                    this.currentUserID = null;
                }
                else{
                    this.currentToken = res.jwt;
                    console.log("Token set to " + this.currentToken);
                }
            }
        ).then(() => {
            if (this.currentToken != null){
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
};