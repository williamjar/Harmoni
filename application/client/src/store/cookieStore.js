import axios from 'axios';
const publicKey = require('../cookieConfig').publicKey;
const jwt = require('jsonwebtoken');

let currentUserID = -1;
let currentToken = null;

export function validateToken() {
    if (currentToken == null || currentUserID === -1){
        console.log("Token doesn't exist");
        return false;
    }
    else{
        try{
            jwt.verify(currentToken, publicKey);
            console.log("Token verified in CookieStore");
            return true;
        }
        catch (err) {
            console.log("Token not verified in CookieStore");
            return false;
        }
    }
}

export function checkToken(email, callback) {
    let header = {
        'x-access-token': currentToken,
        'Content-Type': 'application/json'
    };

    let body = {
        'email': email
    };

    if (currentToken == null){
        callback(500);
    }

    return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.json).then(res => {
            if (res.error){
                currentToken = null;
                currentUserID = null;
                callback(500);
            }
            else{
                currentToken = res.jwt;
                console.log("Token set to " + currentToken);
            }
        }
    ).then(() => {
        if (currentToken != null){
            axios.get("http://localhost:8080/organizer/by-email/" + email, {headers: header}).then(response => response.json).then(IDResponse => {
                if (IDResponse.status === 200 && IDResponse.organizerID){
                    currentUserID = IDResponse.organizerID;
                    callback(200);
                }
                else{
                    currentUserID = null;
                    callback(500);
                }
            })
        }
        else{
            currentUserID = null;
            callback(500);
        }
    }).catch(error => {
        console.log('Error: ' + error.error);
        callback(500);
    });
}

export function setCurrentUserID(userID){
    currentUserID = userID;
}

export function getCurrentUserID() {
    return currentUserID;
}

export function setCurrentToken(newToken) {
    currentToken = newToken;
}

export function getCurrentToken() {
    return currentToken;
}