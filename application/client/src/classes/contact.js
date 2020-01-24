/**
 * @classdesc Contact information of an Organizer, Artist, or Crew.
 */
export class Contact {
    /**
     *
     * @param {int}contactID
     * The ID of the contact object. Generated from the Database
     * @param {String}contactName
     * The name of the contact
     * @param {String}phone
     * The phone number for the contact
     * @param {string}email
     * The email for the contact
     */
    constructor(contactID, contactName, phone, email) {
        this.contactID = contactID;
        this.contactName = contactName;
        this.phone = phone;
        this.email = email;
    }

    static getTestContacts() {
        let contactOne = new Contact(0, 'organizer One', '00 00 12 34', 'mail@organisasjon.no');
        let contactTwo = new Contact(1, 'Artist One', '12345678', 'nummeren@artist.no');
        let contactThree = new Contact(2, 'Artist Two', '98752465', null);
        let contactFour = new Contact(3, 'Crewman One', '52235456', 'dude@crew.com');
        return [contactOne, contactTwo, contactThree, contactFour];
    }
}