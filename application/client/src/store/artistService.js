import axios from "axios";
import {Artist} from "../classes/artist.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";

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
    static createArtist(name, phone, email, genreID, organizerID) {
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

                axios.post(axiosConfig.root  + '/api/artist', artistBody, {headers: header}).then(response =>
                    console.log(response));
                }
        );
    }

    static deleteArtist(artistID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete('/api/artist/organizer/' + artistID, {headers: header}).then(response => response.data);
    }

    static getArtistForOrganizer(organizerID) {
        let allArtistByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/organizer/' + organizerID, {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allArtistByOrganizer.push(new Artist(response.data[i].artistID, response.data[i].organizerID,
                        response.data[i].contactID, response.data[i].organizerID, response.data[i].contactID,
                        response.data[i].contactName, response.data[i].phone, response.data[i].email));
                }
                return allArtistByOrganizer;
            }
        );

    }

    static getArtistForEvent(eventID) {
        let allArtistByEvent = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/artist/event/' + eventID, {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allArtistByEvent.push(new Artist(response.data[i].artistID, response.data[i].organizerID,
                        response.data[i].contactID, response.data[i].organizerID, response.data[i].contactID,
                        response.data[i].contactName, response.data[i].phone, response.data[i].email));
                }
            }
        );
        return allArtistByEvent;
    }

    static addDocumentToArtist(eventID, name, link, artistID, categoryID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.post(axiosConfig.root + '/api/document/artist', {
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "artistID": artistID,
            "documentCategoryID": categoryID
        }, {headers: header}).then(response => response.data);
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

        return axios.delete(axiosConfig.root + '/api/artist/unassign/' + eventID + '/' + artistID, {
            "eventID": eventID,
            "artistID": artistID
        }, {headers: header}).then(response => response.data);
    }

    static getAllGenres(callback){
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


