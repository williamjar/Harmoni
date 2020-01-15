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
    console.log("hashedfromemail Email: " + email);
    getSaltFromEmail(email, salt => {
        console.log("SALT: " + salt);
        let hashed = sha512(enteredPassword, salt);
        console.log("HASHED: " + hashed);
        callback(hashed);
    });
}

export function verifyPassword(organizerID, enteredPassword) {

    let passwordInDB = getPassword(organizerID);
    let salt = getSaltFromID(organizerID);
    let enteredPasswordHashed = sha512(enteredPassword, salt);
    console.log(enteredPasswordHashed + " == " + passwordInDB);

    return (enteredPasswordHashed === passwordInDB);
}

function getSaltFromEmail(email, callback) {
    console.log("getsaltfromemail: " + email);
    getOrganizerID(email, organizerID => {
        console.log("ORGANIZER ID " + organizerID);
        getPassword(organizerID, passwordInDB => {
            console.log("PWD in DB " + passwordInDB);
            let saltHash = passwordInDB.split("/");
            console.log("salthash" + saltHash[0]);
            callback(saltHash[0]);
        })
    });
}

function getSaltFromID(organizerID) {
    getPassword(organizerID, passwordInDB => {
        console.log("getsaltfromID password in db: " + passwordInDB);
        let saltHash = passwordInDB.split("/");
        return saltHash[0];
    });
}


/** Uses email to find the organizers organizerID */
function getOrganizerID(email, callback) {
    let header = {
        "Content-Type": "application/json",
    };
    console.log("getorganizerID email: " + email);
    return axios.get(axiosConfig.root + "/organizer/by-email/" + email, {headers: header})
        .then(res => {
            let organizerID = res.data[0].organizerID;
            console.log("OrganizerID" + organizerID);
            callback(organizerID);
        });
}

/** Uses organizerID to find the organizers password */
function getPassword(organizerID, callback) {
    console.log('OrganizerID: ' + organizerID);
    let header = {
        "Content-Type": "application/json",
    };
    return axios.get(axiosConfig.root + "/organizer/" + organizerID, {headers: header})
        .then(res => {
            let password = res.data[0].password;
            callback(password);
        });
}