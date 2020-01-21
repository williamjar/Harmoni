import axios from "axios";
import {Artist} from "../classes/artist.js"
import {CookieStore} from "./cookieStore";
import {Genre} from "../classes/genre";
import {Document} from "../classes/document";
import {Artist as artist} from "../classes/artist";
import {ArtistEventInfo} from "../classes/artistEventInfo";

const axiosConfig = require("./axiosConfig");

export class ArtistService {

    // artistID, name, phone, email, genre, organizer

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

    static getArtistEventInfo(callback, artistID, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/artistEventInfo', {headers: header}).then(response => {
                console.log("response data");
                console.log(response.data);
                let artistEventInfo = new ArtistEventInfo(response.data[0].artistID, response.data[0].eventID, response.data[0].contractSigned === 1, response.data[0].hasBeenPaid === 1);
                console.log("getArtistEventInfo");
                console.log(artistEventInfo);
                callback(artistEventInfo);
            }
        ).catch(fail => console.log("Error get artist event info " + fail));

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
            console.log(contactBody);

            let artistBody = {
                "genreID": genreID,
                "organizerID": organizerID,
                "contactID": contactRes.data.insertId
            };
            console.log("post contact");
            console.log(contactRes);

            axios.post(axiosConfig.root + '/api/artist', artistBody, {headers: header}).then(artistRes => {
                console.log(artistRes);
                if (artistRes.data.insertId > -1){
                    console.log("artist");
                    let artist = (new Artist(artistRes.data.insertId, contactRes.data.insertId, name, phone, email, genreID, organizerID));
                    console.log(artist);
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
                    allArtistByOrganizer.push(new Artist(response.data[i].artistID, response.data[i].contactID, response.data[i].contactName,
                        response.data[i].phone, response.data[i].email, response.data[i].genreID,
                        response.data[i].organizerID, response.data[i].hasBeenPaid === 1, response.data[i].contractSigned === 1));
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

        axios.get(axiosConfig.root + '/api/artist/event/' + eventID, {headers: header}).then(response => {
            response.data.map(artist =>
                allArtistByEvent.push(new Artist(artist.artistID, artist.contactID, artist.contactName,
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


