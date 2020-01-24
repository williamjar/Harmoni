import {Contact} from "./contact";
import {Organizer} from "./organizer";
import {Document} from "./document";
import {Genre} from "./genre";

/**
 * @classdesc This is an object for storing all the data required to define an artist
 * @see Contact
 */
export class Artist extends Contact {

    /**
     *
     * @param {int} artistID
     * The ID of the artist in question
     * @param {int} contactID
     * The ID of the contact information for the artist
     * @param {String} name
     * The name of the artist (gets sent to super class)
     * @param {String} phone
     * The phone nr. of the artist (gets sent to super class)
     * @param {String} email
     * The email of the artist (gets sent to super class)
     * @param {Genre} genre
     * The genre of the artist
     * @param {Organizer} organizer
     * The organizer that has registered the artist
     * @param {boolean} hasBeenPaid
     * @deprecated
     * Whether the artist has been paid (not in use, see artistEventInfo)
     * @param {boolean} contractSigned
     * @deprecated
     * Whether the artist's contract has been signed (not in use, see artistEventInfo)
     */
    constructor(artistID, contactID, name, phone, email, genre, organizer) {
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