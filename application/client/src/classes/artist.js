import {Contact} from "./contact";
import {Organizer} from "./organizer";
import {Document} from "./document";
import {Genre} from "./genre";

/**
 * @class {Artist}
 * This is an object for storing all the data required to define an artist
 */
export class Artist extends Contact {

    /**
     *
     * @param {int} artistID
     * @param {int} contactID
     * @param {String} name
     * @param {String} phone
     * @param {String} email
     * @param {Genre} genre
     * @param {Organizer} organizer
     * @param {boolean} hasBeenPaid
     * @param {boolean} contractSigned
     */
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
        let artistOne = new Artist(0,
            super.getTestContacts()[1].contactName,
            super.getTestContacts()[1].phone,
            super.getTestContacts()[1].email, new Genre(0, "Folk"), Organizer.getTestOrganizer()[0]);

        let artistTwo = new Artist(1,
            super.getTestContacts()[2].contactName,
            super.getTestContacts()[2].phone,
            super.getTestContacts()[2].email, new Genre(1, "Pop"), Organizer.getTestOrganizer()[0]);

        artistOne.addDocument(Document.getTestDocuments()[0]);

        return [artistOne, artistTwo];
    }
}