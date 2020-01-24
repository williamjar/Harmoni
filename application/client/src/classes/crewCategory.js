/**
 * @classdesc Utility class for connecting crew category IDs and crew category names
 */
export class CrewCategory {

    /**
     *
     * @param {int}crewCategoryID
     * The ID for a crw Category, provided by the database
     * @param {String}crewCategoryName
     * The name of a crew category
     */
    constructor(crewCategoryID, crewCategoryName){
        this.crewCategoryID = crewCategoryID;
        this.crewCategoryName = crewCategoryName;
    }
}