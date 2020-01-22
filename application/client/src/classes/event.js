import {Organizer} from "./organizer";
import {Artist} from "./artist";
import {RiderElement} from "./riderElement";

export class Event {

    constructor(eventID, eventName, startDate, endDate, startTime, endTime, address, town, zipCode, status, description,
                publishDate, publishTime, organizer, eventType, picture) {
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
        this.eventType = eventType;
        this.picture = picture;

        this.tickets = [];
        this.documents = [];
        this.crewMembers = [];
        this.crewCategories = [];
        this.artists = [];
        this.riderElements = [];
    }

    addTicketType(ticketType) {
        this.tickets.push(ticketType);
    }

    addDocument(document) {
        this.documents.push(document);
    }

    addCrewMember(crewMember) {
        this.crewMembers.push(crewMember);
    }

    addCrewCategory(crewCategory) {
        this.crewCategories.push(crewCategory);
    }

    addArtist(artist) {
        this.artists.push(artist);
    }

    addRiderElement(artist, riderElement) {
        this.riderElements.push([artist, riderElement]);
    }

    static getTestEvents() {
        let eventOne = new Event(0, 'Festival4evah',
            '20210101', '20220101', '0000', '0000',
            null, null, null,
            0, 'Some festival',
            null, null,
            Organizer.getTestOrganizer()[0], 1,
            'eventImage.png');

        eventOne.addCrewCategory('Lazy Work');
        eventOne.addCrewCategory('Important Work (empty)');

        eventOne.addArtist(Artist.getTestArtists()[0]);
        eventOne.addArtist(Artist.getTestArtists()[1]);

        eventOne.addRiderElement(eventOne.artists[0], RiderElement.getTestRiderElement()[0]);
        eventOne.addRiderElement(eventOne.artists[1], RiderElement.getTestRiderElement()[1]);
        return [eventOne];
    }

    getRiderFromArtist(artist) {
        let retArr = [];
        for (let i = 0; i < this.riderElements.length; i++) {
            if (this.riderElements[i][0].artistID === artist.artistID) {
                retArr.push(this.riderElements[i][1]);
            }
        }
        return retArr;
    }

    toString() {
        return "Name: " + this.eventName +
            "\nstartDate : " + this.startDate +
            "\nendDate: " + this.endDate +
            "\nstarttime: " + this.startTime +
            "\nendtime: " + this.endTime +
            "\naddress:  " + this.address +
            "\ntown: " + this.town +
            "\nzip: " + this.zipCode +
            "\nstatus: " + this.status +
            "\ndesc: " + this.description +
            "\nPublishDate: " + this.publishDate +
            "\nPublishTime: " + this.publishTime +
            "\nOrganizer: " + this.organizer +
            "\nType: " + this.eventType +
            "\nPic: " + this.picture;
    }

}