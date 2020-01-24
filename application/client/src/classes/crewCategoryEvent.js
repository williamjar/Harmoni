/**
 * @deprecated This class is no longer in use, as it's utility has been consolidated in crewMember
 * @see CrewMember
 */
export class CrewCategoryEvent {

    constructor(crewCategoryID, eventID, responsible){
        this.crewCategoryID = crewCategoryID;
        this.eventID = eventID;
        this.responsible = responsible; //CrewID
        this.crew = [];
    }
}