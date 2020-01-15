export class CrewCategoryEvent {

    constructor(crewCategoryID, eventID, responsible){
        this.crewCategoryID = crewCategoryID;
        this.eventID = eventID;
        this.responsible = responsible; //CrewID
        this.crew = [];
    }
}