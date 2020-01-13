import axios from "axios";
import {Artist} from "../classes/artist.js"

const axiosConfig = require("./axiosConfig");

export class ArtistService {

    // artistID, name, phone, email, genre, organizer

    static getArtist(artistID, callback) {

        axios.get(axiosConfig.root + '/api/artist/' + artistID).then(response => {
                let artist = new Artist(response.data[0].artistID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].genre, response.data[0].organizerID);
                callback(artist);
            }
        );
    }

    // OrganizerID == innlogget bruker.
    static createArtist(name, phone, email, genreID, organizerID) {
        let header = {
            "Content-Type": "application/json"
        };

        let contactBody = {
            "contactName": name,
            "phone": phone,
            "email": email
        };

        let contactID = 0;

        axios.post(axiosConfig.root + '/api/contact', JSON.stringify(contactBody), {headers: header}).then(response => {
                contactID = response.insertId;
            }
        );

        let artistBody = {
            "genreID": genreID,
            "organizerID": organizerID,
            "contactID": contactID
        };

        axios.post('/api/artist', JSON.stringify(artistBody), {headers: header}).then(response =>
            console.log(response));
    }

    static deleteArtist(artistID) {
        return axios.delete('/api/artist/organizer/' + artistID).then(response => response.data);
    }

    static getArtistForOrganizer(organizerID) {
        let allArtistByOrganizer = [];
        axios.get(axiosConfig.root + '/api/artist/organizer/' + organizerID).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allArtistByOrganizer.push(new Artist(response.data[i].artistID, response.data[i].organizerID,
                        response.data[i].contactID, response.data[i].organizerID, response.data[i].contactID,
                        response.data[i].contactName, response.data[i].phone, response.data[i].email));
                }
            }
        );
        return allArtistByOrganizer;
    }

    static getArtistForEvent(eventID) {
        let allArtistByEvent = [];
        axios.get(axiosConfig.root + '/api/artist/event/' + eventID).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allArtistByEvent.push(new Artist(response.data[i].artistID, response.data[i].organizerID,
                        response.data[i].contactID, response.data[i].organizerID, response.data[i].contactID,
                        response.data[i].contactName, response.data[i].phone, response.data[i].email));
                }
            }
        );
        return allArtistByEvent;
    }
}


