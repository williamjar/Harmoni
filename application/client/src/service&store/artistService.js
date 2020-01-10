import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Artist from ".classes/artist.js"

export class ArtistService {

    // artistID, name, phone, email, genre, organizer

    // OrganizerID == logget inn bruker.
    createArtist(name, phone, email, genreID, organizerID) {

        axios.post('/api/contact', {
            "contactName": name,
            "phone": phone,
            "email": email
        }).then((response => response.data);

        // TODO - Get the id from the new created contact
        // let contactID = ?

        axios.post('/api/artist', {
            "genreID": genreID,
            "organizerID": organizerID,
            "contactID": contactID
        });
    }

    getArtistForOrganizer(organizerID) {
        return axios.get < Artist[] > ('/api/artist/organizer/' + organizerID).then(response =>
        );
    }

    getArtistForEvent() {
    }

    // return axios.get<Student[]>('/students').then(response => response.data);

}

export let artistService = sharedComponentData(new artistService());

