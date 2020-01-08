class Event{

    tickets;
    documents;
    crewMembers;
    crewCategories;
    artists;
    riderElements;

    constructor(eventID, eventName, startDate, endDate, startTime, endTime, address, town, zipCode, status, description,
                publishDate, publishTime, organizer, picture){
        this.eventID = eventID;
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.address = address;
        this.town = town;
        this.zipCode = zipCode;
        this.status = status;
        this.description = description;
        this.publishDate = publishDate;
        this.publishTime = publishTime;
        this.organizer = organizer;
        this.picture = picture;
    }

    addTicketType(ticketType){
        this.tickets.add(ticketType);
    }

    addDocument(document){
        this.documents.add(document);
    }

    addCrewMember(crewMember){
        this.crewMembers.add(crewMember);
    }

    addCrewCategory(crewCategory){
        this.crewCategories.add(crewCategory);
    }

    addArtist(artist){
        this.artists.add(artist);
    }

    addRiderElement(artist, riderElement){
        if (this.artists.contains(artist)){
            this.riderElements.add(riderElement);
        }
    }

    static getTestEvents(){
        let eventOne = new Event(0, 'Festival4evah',
            '20210101', '20220101', '0000', '0000',
            null, null, null,
            0, 'Some festival',
            null, null,
            Organizer.getTestOrganizer()[0],
            'eventImage.png');

        eventOne.addCrewCategory('Lazy Work');
        eventOne.addCrewCategory('Important Work (empty)');
        eventOne.addArtist(Artist.getTestArtists()[0]);
        eventOne.addArtist(Artist.getTestArtists()[1]);

        eventOne.addRiderElement(eventOne.artists[0], RiderElement.getTestRiderElement()[0]);
        eventOne.addRiderElement(eventOne.artists[1], RiderElement.getTestRiderElement()[1]);

    }

}