import {CrewMember} from "./crewMember";

export class CrewLeader extends CrewMember{
    constructor(crewID, name, phone, email, description, crewCategory){
        super(crewID, name, phone, email, description);
        this.crewCategory = crewCategory;
    }

    static getTestCrewLeader(){
        let crewLeader = new CrewLeader(super.getTestCrewMember()[0].crewID,
            super.getTestCrewMember()[0].contactName,
            super.getTestCrewMember()[0].phone,
            super.getTestCrewMember()[0].email,
            super.getTestCrewMember()[0].crewCategories[0]);
        for (let i = 0; i < super.getTestCrewMember()[0].crewCategories.length; i++){
            crewLeader.addCrewCategory(super.getTestCrewMember()[0].crewCategories[i]);
        }
        crewLeader.crewCategory = crewLeader.crewCategories[0];
        return [crewLeader];
    }
}
