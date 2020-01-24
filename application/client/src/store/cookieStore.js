import axios from 'axios';
import {OrganizerStore} from "./organizerStore";
import {EventStore} from "./eventStore";

const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

/**
 * @class CookieStore
 * @classdesc Store class for functions related to accessing and modifying tokens.
 */
export class CookieStore{

    static currentToken = null;
    static currentUserID = -1;

    /**
     * Set method for changing currentToken
     * @param {String} newToken
     */
    static setCurrentToken(newToken){
        try{
            this.currentToken = newToken;
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * Set method for changing currentUserID
     * @param {int} newID
     */
    static setCurrentUserID(newID){
        this.currentUserID = newID;
    }

    /**
     * TODO
     * @param {function} callback
     */
    static validateToken(callback){

        if (sessionStorage.getItem("loggedIn")){
            this.currentToken = sessionStorage.getItem("token");
            try{
                let email = jwt.decode(sessionStorage.getItem(('token')), publicKey).email;

                this.checkToken(email, statusCode => {
                    callback(statusCode === 200);
                });
            }
            catch (err) {
                callback(false);
            }
        }
        else{
            callback(false);
        }
    }

    /**
     * TODO
     * @param {int} token
     * @param {function} callback
     */
    static validateArtistToken(token, callback){
        try{
            jwt.verify(token, publicKey);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * TODO
     * @param {String} email
     * @param {function} callback
     */
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
                if (res.error){
                    this.currentToken = null;
                    this.currentUserID = -1;
                    callback(500);
                }
                else{
                    sessionStorage.setItem("token", res.jwt);
                    this.currentToken = res.jwt;
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