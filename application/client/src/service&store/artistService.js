import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Artist from ".classes/artist.js"

const axiosConfig = require("./axiosConfig");

export class ArtistService {

    // artistID, name, phone, email, genre, organizer

    getArtist(artistID) {
        axios.get(axiosConfig.root + '/api/artist/' + artistID).then(response => {
                return new Artist(response.data[0].artistID, response.data[0].organizerID,
                    response.data[0].contactID, response.data[0].organizerID, response.data[0].contactID,
                    response.data[0].contactName, response.data[0].phone, response.data[0].email);
            }
        );
    }

    // OrganizerID == innlogget bruker.
    createArtist(name, phone, email, genreID, organizerID) {
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

        // TODO - Get the id from the new created contact

        let artistBody = {
            "genreID": genreID,
            "organizerID": organizerID,
            "contactID": contactID
        };

        axios.post('/api/artist', JSON.stringify(artistBody), {headers: header}).then(response =>
            console.log(response));
    }

    deleteArtist(artistID) {
        axios.delete('/api/artist/organizer/' + artistID).then(response => console.log(response));
    }

    getArtistForOrganizer(organizerID) {
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

    getArtistForEvent(eventID) {
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

export let artistService = sharedComponentData(new artistService());

