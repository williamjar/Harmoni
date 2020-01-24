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
     */
    constructor(artistID, contactID, name, phone, email, genre, organizer) {
        super(contactID, name, phone, email);
        this.artistID = artistID;
        this.genre = genre;
        this.organizer = organizer;
        this.events = [];
        this.documents = [];
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