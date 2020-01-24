/**
 * @class {ArtistEventInfo}
 * A class for storing information relating to a artist connected to an event
 * This class contains information on whether the artist has been paid and if the artist's contract has been signed
 */
export class ArtistEventInfo {

    /**
     *
     * @param {int} artistID
     * @param {int} eventID
     * @param {boolean} contractSigned
     * @param {boolean} hasBeenPaid
     */
    constructor(artistID, eventID, contractSigned, hasBeenPaid){
        this.artistID = artistID;
        this.eventID = eventID;
        this.contractSigned = contractSigned;
        this.hasBeenPaid = hasBeenPaid;
    }
}