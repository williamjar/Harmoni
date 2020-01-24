/**
 * @classdesc Utility class used for connection a genre ID and the name of that genre (please ignore the spelling mistakes)
 */
export class Genre{

    /**
     *
     * @param {int}genreID
     * The ID of a genre.
     * @param {String}genreName
     * The name of a genre.
     */
    constructor(genreID, genreName){
        this.genreID = genreID;
        this.genreName = genreName;
    }
}