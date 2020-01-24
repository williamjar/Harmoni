/**
 * @classdesc A class for storing information relating to a artist connected to an event
 * This class contains information on whether the artist has been paid and if the artist's contract has been signed
 */
export class ArtistEventInfo {

    /**
     *
     * @param {int} artistID
     * The ID of the artist in question
     * @param {int} eventID
     * The ID of the event in question
     * @param {boolean} contractSigned
     * A boolean value deciding if the artist/event contract has been signed
     * @param {boolean} hasBeenPaid
     * A boolean value deciding if the artist has been paid for the event
     */
    constructor(artistID, eventID, contractSigned, hasBeenPaid){
        this.artistID = artistID;
        this.eventID = eventID;
        this.contractSigned = contractSigned;
        this.hasBeenPaid = hasBeenPaid;
    }
}