import axios from "axios";
import {Artist} from "../classes/artist.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import {Document} from "../classes/document";
import {ArtistEventInfo} from "../classes/artistEventInfo";

const axiosConfig = require("./axiosConfig");

/**
 * @class ArtistService
 * @classdesc Service class for functions related to accessing and modifying crew objects.
 */
export class ArtistService {

    /**
     * Returns a specific artist as an artist object in the callback with data from the database.
     * @param {int} artistID - The database ID of the artist.
     * @param {function} callback
     */
    static getArtist(artistID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/' + artistID, {headers: header}).then(response => {
                if (response.data.length > 0){
                    let artist = new Artist(response.data[0].artistID,response.data[0].contactID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].genre, response.data[0].organizerID);
                    callback(artist);
                }
                else{
                    callback(null);
                }
            }
        ).catch(err => console.log(err));
    }

    /**
     * Returns info about a an artist assignment with data from the database in the callback as an artistEventInfo object.
     * @param {function} callback
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     */
    static getArtistEventInfo(callback, artistID, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/artistEventInfo', {headers: header}).then(response => {
                let artistEventInfo = new ArtistEventInfo(response.data[0].artistID, response.data[0].eventID, response.data[0].contractSigned === 1, response.data[0].hasBeenPaid === 1);
                callback(artistEventInfo);
            }
        ).catch(fail => console.log("Error get artist event info " + fail));
    }

    /**
     * Returns info about a an artist assignment with data from the database in the callback as an artistEventInfo object.
     * @param {function} callback
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {int} contractSigned - (True/false) Whether the artist has signed the contract or not.
     * @param {int} hasBeenPaid - (True/false) Whether the artist has been paid or not.
     */
    static updateArtistEventInfo(callback, artistID, eventID, contractSigned, hasBeenPaid) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let artistEventInfoBody = {
            "contractSigned": contractSigned ? 1 : 0,
            "hasBeenPaid": hasBeenPaid ? 1 : 0
        };

        axios.put(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/artistEventInfo', artistEventInfoBody, {headers: header}).then(response => {
                callback();
            }
        );
    }

    /**
     * Updates a specific artist's genre in the database.
     * @param {function} callback
     * @param {int} artistID - The database ID of the artist.
     * @param {int} genreID - The database ID of the genre.
     * @param {int} organizerID - The database ID of the organizer.
     * @param {int} contactID - The database ID of the contact.
     */
    static updateArtistGenre(callback, artistID, genreID, organizerID, contactID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        let artistGenreBody = {
            "genreID" : genreID,
            "organizerID" : organizerID,
            "contactID" : contactID,
        };
        axios.put(axiosConfig.root +"/api/artist/" +artistID, artistGenreBody, {headers: header}).then(response => {
            callback();
        })
    }

    /**
     * Creates a new artist in the database and returns it as an artist object in the callback.
     * @param {function} callback
     * @param {string} name - Name of artist.
     * @param {string} phone - Phone number of artist.
     * @param {string} email - Email of artist.
     * @param {int} genreID - The database ID of the contact.
     * @param {int} organizerID - The database ID of the organizer.
     */
    static createArtist(callback, name, phone, email, genreID, organizerID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let contactBody = {
            "username": name,
            "phone": phone,
            "email": email
        };

        axios.post(axiosConfig.root + '/api/contact', contactBody, {headers: header}).then(contactRes => {
            let artistBody = {
                "genreID": genreID,
                "organizerID": organizerID,
                "contactID": contactRes.data.insertId
            };

            axios.post(axiosConfig.root + '/api/artist', artistBody, {headers: header}).then(artistRes => {
                if (artistRes.data.insertId > -1){
                    //artistID, contactID, name, phone, email, genre, organizer, hasBeenPaid, contractSigned
                    let artist = (new Artist(artistRes.data.insertId, contactRes.data.insertId, name, phone, email, genreID, organizerID, false, false));
                    callback(artist);
                    return artist;
                }
                else{
                    callback(null);
                    return null;
                }
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    /**
     * Deletes an artist from the database.
     * @param {int} contactID - The database ID of the artist in the contact table.
     */
    static deleteArtist(contactID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/artist/' + contactID, {headers: header}).then(response => response.data);
    }

    /**
     * Returns all artists for a specific organizer in an array of artist objects created with data from the database.
     * @param {function} callback -
     * @param {int} organizerID - The database ID of the organizer.
     */
    static getArtistForOrganizer(callback, organizerID) {
        let allArtistByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/organizer/' + organizerID, {headers: header}).then(response => {
            allArtistByOrganizer = response.data.map(artist => new Artist(artist.artistID, artist.contactID, artist.contactName,
                artist.phone, artist.email, artist.genreID,
                artist.organizerID, artist.hasBeenPaid === 1, artist.contractSigned === 1));
                callback(allArtistByOrganizer);
            }
        );
    }

    /**
     * Returns all artists for a specific organizer and event in an array of artist objects created with data from the database.
     * @param {function} callback -
     * @param {int} eventID - The database ID of the event.
     */
    static getArtistsForEvent(callback, eventID) {
        let allArtistByEvent = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/event/' + eventID, {headers: header}).then(response => {
            allArtistByEvent = response.data.map(artist => new Artist(artist.artistID, artist.contactID, artist.contactName,
                artist.phone, artist.email, artist.genreID,
                artist.organizerID));
        }).then(() => {
            allArtistByEvent.map(artist => {
                axios.get(axiosConfig.root + '/api/artist/documents/' + eventID + '/' + artist.artistID, {headers: header}).then(artistDocumentResponse => {
                    artist.documents = artistDocumentResponse.data.map(document => new Document(document.documentID, document.eventID, document.documentName, document.documentLink, document.artistID, document.crewID, document.documentCategoryID));
                }).then(() => artist);
                return 0;
            });
        }).then(() => {
            callback(allArtistByEvent)
        });
    }

    /**
     * Assigns an artist to an event.
     * @param {int} eventID - The database ID of the event.
     * @param {int} artistID - The database ID of the artist.
     */
    static assignArtist(eventID, artistID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.post(axiosConfig.root + '/api/artist/assign', {
            "eventID": eventID,
            "artistID": artistID
        }, {headers: header}).then(response => response.data);
    }

    /**
     * Unassigns an artist to an event.
     * @param {int} eventID - The database ID of the event.
     * @param {int} artistID - The database ID of the artist.
     */
    static unAssignArtist(eventID, artistID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/artist/assign/' + eventID + '/' + artistID, {headers: header}).then(response => response.data);
    }

    /**
     * Return all genres in a list of genre objects created with data from the database.
     * @param {function} callback -
     * @return {Promise} The promise from the database call.
     */
    static getAllGenres(callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.get(axiosConfig.root + "/api/artist-genres", {headers: header})
            .then(res => res.data)
            .then(data => data
                .map(element => new Genre(element.genreID, element.genreName)))
            .then(genreList => callback(genreList));
    }

    /**
     * Returns the token for the artist login in the callback.
     * @param {int} artistID - The database ID of the artist.
     * @param {int} eventID - The database ID of the event.
     * @param {function} callback - Returns status code and token if successful.
     */
    static getArtistToken(artistID, eventID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let body = {
            artistID: artistID,
            eventID: eventID
        };

        axios.post(axiosConfig.root + "/api/artist/personalLink", JSON.stringify(body), {headers: header}).then(response => {
            if (response.err){
                callback(500);
            }
            else{
                callback(200, response.data.jwt);
            }
        }).catch(callback(500));
    }

    /**
     * Decodes a token via the database.
     * @param {int} token - The database ID of the artist.
     * @param {function} callback - Returns status code and decoded data if successful.
     */
    static decodeToken(token, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": token
        };
        axios.get(axiosConfig.root + "/decodeArtistToken", {headers: header}).then(response => {
            if (response.data.error){
                callback(500, response.error);
            }
            else{
                callback(200, response.data);
            }
        });
    }

}


