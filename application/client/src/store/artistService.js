import axios from "axios";
import {Artist} from "../classes/artist.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import {Document} from "../classes/document";
import {Artist as artist} from "../classes/artist";
import {ArtistEventInfo} from "../classes/artistEventInfo";

const axiosConfig = require("./axiosConfig");

export class ArtistService {

    static currentArtist;
    static allArtistsForOrganizer;
    static allArtistsForEventAndOrganizer;

    static getArtist(artistID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/' + artistID, {headers: header}).then(response => {
                this.currentArtist = new Artist(response.data[0].artistID, response.data[0].contactID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].genre, response.data[0].organizerID);
                callback(artist);
            }
        );
    }

    static getArtistEventInfo(callback, artistID, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/artistEventInfo', {headers: header}).then(response => {
                console.log(response);
                let artistEventInfo = new ArtistEventInfo(response.data[0].artistID, response.data[0].contactID, response.data[0].eventID, response.data[0].contractSigned === 1, response.data[0].hasBeenPaid === 1);
                console.log("getArtistEventInfo");
                console.log(artistEventInfo);
                callback(artistEventInfo);
            }
        );

    }

    static updateArtistEventInfo(callback, artistID, eventID, contractSigned, hasBeenPaid) {

        console.log("updateArtistEventInfo has been paid: " + hasBeenPaid);

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

    // OrganizerID == innlogget bruker.
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
                "contactID": response.data.insertId
            };
            console.log("post contact");
            console.log(contactRes);

            axios.post(axiosConfig.root + '/api/artist', artistBody, {headers: header}).then(artistRes => {
                console.log("artist");
                console.log(artistRes);
                this.currentArtist = new Artist(artistRes.data.insertId, contactRes.data.insertId, name, phone, email, genreID, organizerID);
                callback();
            });
        });
    }

    static deleteArtist() {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete('/api/artist/organizer/' + this.currentArtist, {headers: header}).then(response => response.data);
    }

    static getArtistForOrganizer(callback, organizerID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/organizer/' + organizerID, {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    this.allArtistsForOrganizer.push(new Artist(response.data[i].artistID, response.data[i].contactID, response.data[i].contactName,
                        response.data[i].phone, response.data[i].email, response.data[i].genreID,
                        response.data[i].organizerID));
                }
                callback();
            }
        )
    }

    static getArtistsForEvent(callback, eventID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/event/' + eventID, {headers: header}).then(response => {
            response.data.map(artist =>
                this.allArtistsForEventAndOrganizer.push(new Artist(artist.artistID, artist.contactName,
                    artist.phone, artist.email, artist.genreID,
                    artist.organizerID)));
        }).then(() => {
            this.allArtistsForEventAndOrganizer.map(artist => {
                axios.get(axiosConfig.root + '/api/artist/documents/' + eventID + '/' + artist.artistID, {headers: header}).then(response => {
                    response.data.map(document => artist.addDocument(new Document(document.documentID, document.documentLink, document.documentCategory)))
                }).then(() => artist);
            });
        }).then(() => {
            callback()
        });
    }

    static assignArtist(eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.post(axiosConfig.root + '/api/artist/assign', {
            "eventID": eventID,
            "artistID": this.currentArtist.artistID
        }, {headers: header}).then(response => response.data);
    }

    static unAssignArtist(eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/artist/assign/' + eventID + '/' + this.currentArtist.artistID, {headers: header}).then(response => response.data);
    }

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

}


