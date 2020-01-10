import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Artist from ".classes/artist.js"

class ArtistService {

    // artistID, name, phone, email, genre, organizer

    getArtist() {
        let a = new Artist(name,phone,email,genre,organizer);
        axios.get('/api/artist/1');

    }

    createArtist() {

    }

    getArtistForOrganizer() {
        axios.get('/api/artist/1');

    }

    getArtistForEvent() {
    }



    // return axios.get<Student[]>('/students').then(response => response.data);



}