import {Contact} from "./contact";
import {Organizer} from "./organizer";
import {Event} from "./event";
import {Document} from "./document";

export class Artist extends Contact{

    constructor(artistID, name, phone, email, genre, organizer){
        super(name, phone, email);
        this.artistID = artistID;
        this.genre = genre;
        this.organizer = organizer;
        //this.events = [];
        //this.documents = [];
    }

    addEvent(event){
        this.events.push(event);
    }

    addDocument(document){
        this.documents.push(document);
    }

    static getTestArtists(){
        let artistOne = new Artist(0,
            super.getTestContacts()[1].contactName,
            super.getTestContacts()[1].phone,
            super.getTestContacts()[1].email, 'Folk', Organizer.getTestOrganizer()[0]);

        let artistTwo = new Artist(1,
            super.getTestContacts()[2].contactName,
            super.getTestContacts()[2].phone,
            super.getTestContacts()[2].email, 'Pop', Organizer.getTestOrganizer()[0]);

        artistOne.addDocument(Document.getTestDocuments()[0]);

        return [artistOne, artistTwo];
    }
}