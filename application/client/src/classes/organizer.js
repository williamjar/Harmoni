import {Contact} from "./contact";
import {CrewLeader} from "./crewLeader";
import {Event} from "./event";

export class Organizer extends Contact{

    constructor(organizerID, name, phone, email, username, pictureLink){
        super(name, phone, email);
        this.organizerID = organizerID;
        this.username = username;
        this.pictureLink = pictureLink;
        this.events = [];
        this.contacts = [];
        this.crewCategories = [];
    }

    addEvent(event){
        this.events.push(event);
    }

    checkPassword(username, password){
        return username === 'admin';
    }

    addContact(contact){
        this.contacts.push(contact);
    }

    addCrewCategory(category){
        this.crewCategories.push(category);
    }

    static getTestOrganizer(){
        let organizer = new Organizer(0,
            super.getTestContacts()[0].contactName, super.getTestContacts()[0].phone, super.getTestContacts()[0].email,
            'OrganisatorFirmaet AS', null);
        organizer.addContact(super.getTestContacts()[1]);
        organizer.addContact(super.getTestContacts()[2]);
        organizer.addContact(super.getTestContacts()[3]);
        //organizer.addCrewCategory(CrewLeader.getTestCrewLeader()[0].crewCategory);

        //organizer.addEvent(Event.getTestEvents()[0]);

        return [organizer];
    }
}