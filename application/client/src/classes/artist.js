class Artist extends Contact{

    events;
    documents;

    constructor(artistID, name, phone, email, genre, organizer){
        super(name, phone, email);
        this.genre = genre;
        this.organizer = organizer;
    }

    addEvent(event){
        this.events.add(event);
    }

    addDocument(document){
        this.documents.add(document);
    }

    static getTestArtists(){
        let contactOne = new Contact('Organizer One', '00 00 12 34', 'mail@organisasjon.no');
        let contactTwo = new Contact('Artist One', '12345678', 'nummeren@artist.no');
        let contactThree = new Contact('Artist Two', '98752465');
        let organizer = new Organizer(0, contactOne.contactName, contactOne.phone, contactOne.email, 'Organizer', 'img.png');
        let artistOne = new Artist(0, contactTwo.contactName, contactTwo.phone, contactTwo.email, 'Folk', organizer);
        let artistTwo = new Artist(1, contactThree.name, contactThree.phone, contactThree.email, 'Pop', organizer);
        artistOne.addDocument(Document.getTestDocuments()[0]);

        artistOne.addEvent(Event.getTestEvents()[0]);
        artistTwo.addEvent(Event.getTestEvents()[0]);

        return [artistOne, artistTwo];
    }
}