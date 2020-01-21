import axios from "axios";

const crypto = require('crypto');
let axiosConfig = require("./axiosConfig");

/** Encryption */
export function sha512(password, salt) {
    let hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');
    return salt + '/' + value;
}

export function generateSalt(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex').slice(0, length);
}

export function getHashedFromEmail(enteredPassword, email, callback) {
    getSaltFromEmail(email, salt => {
        if (salt) {
            let hashed = sha512(enteredPassword, salt);
            callback(hashed);
        } else {
            callback();
        }
    });
}

export function verifyPassword(organizerID, enteredPassword, callback) {
    getPassword(organizerID, passwordInDB => {
        getSaltFromID(organizerID, salt => {
            let enteredPasswordHashed = sha512(enteredPassword, salt);
            callback(enteredPasswordHashed === passwordInDB);
        });
    });
}

export function getSaltFromEmail(email, callback) {
    getOrganizerID(email, organizerID => {
        if (organizerID) {
            getPassword(organizerID, passwordInDB => {
                let saltHash = passwordInDB.split("/");
                console.log('salt ' + saltHash);
                callback(saltHash[0]);
            })
        } else {
            callback();
        }
    });
}

export function getSaltFromID(organizerID, callback) {
    getPassword(organizerID, passwordInDB => {
        let saltHash = passwordInDB.split("/");
        callback(saltHash[0]);
    });
}


/** Uses email to find the organizers organizerID */
export function getOrganizerID(email, callback) {
    let header = {
        "Content-Type": "application/json",
    };
    axios.get(axiosConfig.root + "/organizer/by-email/" + email, {headers: header})
        .then(res => {
            if (res.data.length > 0) {
                let organizerID = res.data[0].organizerID;
                callback(organizerID);
            } else {
                console.log("No email");
                callback();
            }
        });
}

/** Uses organizerID to find the organizers password */
export function getPassword(organizerID, callback) {
    let header = {
        "Content-Type": "application/json",
    };
    axios.get(axiosConfig.root + "/organizer/" + organizerID, {headers: header})
        .then(res => {
            let password = res.data[0].password;
            callback(password);
        });
}