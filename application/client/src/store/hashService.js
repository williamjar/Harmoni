import axios from "axios";
const crypto = require('crypto');
let axiosConfig = require("./axiosConfig");


/**
 * @class hashService
 * @classdesc Service class for functions related to encryption.
 */
export class hashService {

    /**
     * Encryption method used for hashing.
     * @param {string} password - The password in plaintext.
     * @param {string} salt - Random data used in the encryption process.
     * @return {string} A combination of the salt and the encrypted password.
     */
    static sha512(password, salt) {
        let hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        let value = hash.digest('hex');
        return salt + '/' + value;
    }

    /**
     * Generates the salt using random bytes.
     * @param {int} length - How long the salt generated should be.
     * @return {String} Finished salt.
     */
    static generateSalt(length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex').slice(0, length);
    }

    /**
     * Uses input email to return the hashed password stored in the database in the callback.
     * @param {String} enteredPassword - Password in plaintext.
     * @param {String} email - The email address to search the database with.
     * @param {function} callback.
     */
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

    /**
     * Checks if the input password matches with the logged in organizers password stores in the database. Returns true or false in the callback.
     * @param {int} organizerID - The database ID of the logged in organizer.
     * @param {String} enteredPassword - Password in plaintext.
     * @param {function} callback.
     */
    static verifyPassword(organizerID, enteredPassword, callback) {
        this.getPassword(organizerID, passwordInDB => {
            this.getSaltFromID(organizerID, salt => {
                let enteredPasswordHashed = this.sha512(enteredPassword, salt);
                callback(enteredPasswordHashed === passwordInDB);
            });
        });
    }

    /**
     * Uses input email to return the salt stored in the database in the callback.
     * @param {String} email - The email address to search the database with.
     * @param {function} callback.
     */
    static getSaltFromEmail(email, callback) {
        this.getOrganizerID(email, organizerID => {
            if (organizerID) {
                this.getPassword(organizerID, passwordInDB => {
                    let saltHash = passwordInDB.split("/");
                    callback(saltHash[0]);
                })
            } else {
                callback();
            }
        });
    }

    /**
     * Uses input email to return the salt stored in the database in the callback.
     * @param {int} organizerID - The database ID of the in organizer.
     * @param {function} callback.
     */
    static getSaltFromID(organizerID, callback) {
        this.getPassword(organizerID, passwordInDB => {
            let saltHash = passwordInDB.split("/");
            callback(saltHash[0]);
        });
    }

    /**
     * Uses input email to return the the organizerID stored in the database in the callback.
     * @param {String} email - The email address to search the database with.
     * @param {function} callback.
     */
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
                    callback();
                }
            });
    }

    /**
     * Uses input organizerID to return the the password stored in the database in the callback.
     * @param {int} organizerID - The email address to search the database with.
     * @param {function} callback.
     */
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