class Organizer extends Contact{

    events;
    contacts;
    crewCategories;

    constructor(organizerID, name, phone, email, username, pictureLink){
        super(name, phone, email);
        this.organizerID = organizerID;
        this.username = username;
        this.pictureLink = pictureLink;
    }

    addEvent(event){
        this.events.add(event);
    }

    checkPassword(username, password){
        return username === 'admin';
    }

    addContact(contact){
        this.contacts.add(contact);
    }

    addCrewCategory(category){
        this.crewCategories.add(category);
    }

    static getTestOrganizer(){
        let organizer = new Organizer(0,
            super.getTestContact()[0].contactName, super.getTestContact()[0].phone, super.getTestContact()[0].email,
            'OrganisatorFirmaet AS', null);
        organizer.addContact(super.getTestContact()[1]);
        organizer.addContact(super.getTestContact()[2]);
        organizer.addContact(super.getTestContact()[3]);
        organizer.addCrewCategory(CrewLeader.getTestCrewLeader()[0].crewCategory);

        organizer.addEvent(Event.getTestEvents()[0]);

        return [organizer];
    }
}