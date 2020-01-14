import {CrewMember} from "./crewMember";

export class CrewLeader{
    constructor(crewID, name, phone, email, description, crewCategory, eventID){
        this.crewID = crewID;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.description = description;
        this.crewCategory = crewCategory;
        this.eventID = eventID;
    }

    /*constructor(crewMember, leaderCategory){
        super(crewMember.crewID, crewMember.name, crewMember.phone, crewMember.email, crewMember.description);
        this.crewCategory = leaderCategory;
    }*/

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