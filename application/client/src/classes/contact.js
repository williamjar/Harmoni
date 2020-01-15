export class Contact{
    constructor(contactName, phone, email){
        this.contactName = contactName;
        this.phone = phone;
        this.email = email;
    }

    static getTestContacts(){
        let contactOne = new Contact('organizer One', '00 00 12 34', 'mail@organisasjon.no');
        let contactTwo = new Contact('Artist One', '12345678', 'nummeren@artist.no');
        let contactThree = new Contact('Artist Two', '98752465', null);
        let contactFour = new Contact('Crewman One', '52235456', 'dude@crew.com');
        return [contactOne, contactTwo, contactThree, contactFour];
    }
}