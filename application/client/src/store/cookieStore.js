import axios from 'axios';

const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

export class CookieStore{

    static currentToken = "";
    static currentUserID = -1;

    static validateToken(){

        console.log("Validating token");

        if (this.currentToken == null || this.currentToken.trim() === '' || this.currentUserID == null){
            console.log("Token:" + this.currentToken);
            console.log("ID" + this.currentUserID);
            console.log("Token doesn't exist");
            return false;
        }

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

    static checkToken(email){
        let header = {
            'x-access-token': this.currentToken,
            'Content-Type': 'application/json'
        };

        let body = {
            'email': email
        };

        if (CookieStore.currentToken == null){
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
}