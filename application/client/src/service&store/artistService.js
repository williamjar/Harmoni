import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Artist from ".classes/artist.js"
const axiosConfig = require("./axiosConfig");

export class ArtistService {

    // artistID, name, phone, email, genre, organizer
    // OrganizerID == innlogget bruker.

    createArtist(name, phone, email, genreID, organizerID) {
        let contactID = 0;

        axios.post('/api/contact', {
            "contactName": name,
            "phone": phone,
            "email": email
        }).then(response => {
                response.data.insertId = contactID
            }
        );

        // TODO - Get the id from the new created contact

        axios.post('/api/artist', {
            "genreID": genreID,
            "organizerID": organizerID,
            "contactID": contactID
        });
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

