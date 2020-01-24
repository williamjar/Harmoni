import axios from "axios";
const crypto = require('crypto');
let axiosConfig = require("./axiosConfig");

export class hashService {

    /** Encryption */
    static sha512(password, salt) {
        let hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        let value = hash.digest('hex');
        return salt + '/' + value;
    }

    static generateSalt(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex').slice(0, length);
    }

    static getHashedFromEmail(enteredPassword, email, callback) {
        this.getSaltFromEmail(email, salt => {
            if (salt) {
                let hashed = this.sha512(enteredPassword, salt);
                callback(hashed);
            } else {
                callback();
            }
        });
    }

    static verifyPassword(organizerID, enteredPassword, callback) {
        this.getPassword(organizerID, passwordInDB => {
            this.getSaltFromID(organizerID, salt => {
                let enteredPasswordHashed = this.sha512(enteredPassword, salt);
                callback(enteredPasswordHashed === passwordInDB);
            });
        });
    }

    static getSaltFromEmail(email, callback) {
        this.getOrganizerID(email, organizerID => {
            if (organizerID) {
                this.getPassword(organizerID, passwordInDB => {
                    let saltHash = passwordInDB.split("/");
                    console.log('salt ' + saltHash);
                    callback(saltHash[0]);
                })
            } else {
                callback();
            }
        });
    }

    static getSaltFromID(organizerID, callback) {
        this.getPassword(organizerID, passwordInDB => {
            let saltHash = passwordInDB.split("/");
            callback(saltHash[0]);
        });
    }


    /** Uses email to find the organizers organizerID */
    static getOrganizerID(email, callback) {
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
    static getPassword(organizerID, callback) {
        let header = {
            "Content-Type": "application/json",
        };
        axios.get(axiosConfig.root + "/organizer/" + organizerID, {headers: header})
            .then(res => {
                let password = res.data[0].password;
                callback(password);
            });
    }
}