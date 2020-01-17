import axios from "axios";
import {Artist} from "../classes/artist.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import {Document} from "../classes/document";
import {Artist as artist} from "../classes/artist";

const axiosConfig = require("./axiosConfig");

export class ArtistService {

    // artistID, name, phone, email, genre, organizer

    static getArtist(artistID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/artist/' + artistID, {headers: header}).then(response => {
                let artist = new Artist(response.data[0].artistID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].genre, response.data[0].organizerID);
                callback(artist);
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

        axios.post(axiosConfig.root + '/api/contact', contactBody, {headers: header}).then(response => {

            let artistBody = {
                "genreID": genreID,
                "organizerID": organizerID,
                "contactID": response.data.insertId
            };
            console.log("post contact");
            console.log(response);

            axios.post(axiosConfig.root + '/api/artist', artistBody, {headers: header}).then(res => {
                console.log("artist");
                console.log(res);
                callback(new Artist(res.data.insertId, name, phone, email, genreID, organizerID));
            });
        });
    }

    static deleteArtist(artistID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete('/api/artist/organizer/' + artistID, {headers: header}).then(response => response.data);
    }

    static getArtistForOrganizer(callback, organizerID) {
        let allArtistByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/organizer/' + organizerID, {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allArtistByOrganizer.push(new Artist(response.data[i].artistID, response.data[i].contactName,
                        response.data[i].phone, response.data[i].email, response.data[i].genreID,
                        response.data[i].organizerID));
                }
                callback(allArtistByOrganizer);
            }
        );

    }

    static getArtistsForEvent(callback, eventID) {
        let allArtistByEvent = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        //TODO!!
        axios.get(axiosConfig.root + '/api/artist/event/' + eventID, {headers: header}).then(response => {
            response.data.map(artist =>
                allArtistByEvent.push(new Artist(artist.artistID, artist.contactName,
                    artist.phone, artist.email, artist.genreID,
                    artist.organizerID)));
        }).then(() => {
            allArtistByEvent.map(artist => {
                axios.get(axiosConfig.root + '/api/artist/documents/' + eventID + '/' + artist.artistID, {headers: header}).then(response => {
                    response.data.map(document => artist.addDocument(new Document(document.documentID, document.documentLink, document.documentCategory)))
                }).then(() => artist);
            });
        }).then(() => {
            callback(allArtistByEvent)
        });
    }

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

    static unAssignArtist(eventID, artistID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/artist/assign/' + eventID + '/' + artistID, {headers: header}).then(response => response.data);
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


