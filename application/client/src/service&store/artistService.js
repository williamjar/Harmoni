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
        let contactID;

        axios.post(axiosConfig.root + '/api/contact', {
            "contactName": name,
            "phone": phone,
            "email": email
        }).then(response => {
                response.data[0].insertId = contactID;
            }
        );

        // TODO - Get the id from the new created contact

        axios.post('/api/artist', {
            "genreID": genreID,
            "organizerID": organizerID,
            "contactID": contactID
        });
    }

    deleteArtist(artistID) {
        axios.delete('/api/artist/organizer/' + artistID).then(response => {

            }
        );
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

