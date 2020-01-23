import {Contact} from "./contact";
import {Organizer} from "./organizer";
import {Document} from "./document";
import {Genre} from "./genre";

export class Artist extends Contact {

    constructor(artistID, contactID, name, phone, email, genre, organizer, hasBeenPaid, contractSigned) {
        super(contactID, name, phone, email);
        this.artistID = artistID;
        this.genre = genre;
        this.organizer = organizer;
        this.events = [];
        this.documents = [];
        this.hasBeenPaid = hasBeenPaid;
        this.contractSigned = contractSigned;
    }

    addEvent(event) {
        this.events.push(event);
    }

    addDocument(document) {
        this.documents.push(document);
    }

    addDocuments(documents) {
        for (let i = 0; i < documents.length; i++) {
            this.documents.push(documents[i]);
        }
    }

    static getTestArtists() {

        let artistOne = new Artist(0, super.getTestContacts()[1].contactID, super.getTestContacts()[1].contactName, super.getTestContacts()[1].phone,
                                    super.getTestContacts()[1].email, new Genre(0, "Folk"), Organizer.getTestOrganizer()[0], false, false);

        let artistTwo = new Artist(0, super.getTestContacts()[2].contactID, super.getTestContacts()[2].contactName, super.getTestContacts()[2].phone,
            super.getTestContacts()[2].email, new Genre(0, "Folk"), Organizer.getTestOrganizer()[0], false, false);


        artistOne.addDocument(Document.getTestDocuments()[0]);

        return [artistOne, artistTwo];
    }
}