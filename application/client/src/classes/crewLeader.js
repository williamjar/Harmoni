import {CrewMember} from "./crewMember";

export class CrewLeader extends CrewMember{
    constructor(crewID, name, phone, email, description, crewCategory){
        super(crewID, name, phone, email, description, true);
        this.crewCategory = crewCategory;
    }

    static getTestCrewLeader(){
        let crewLeader = new CrewLeader(super.getTestCrewMember()[0].crewID, super.getTestCrewMember()[0].contactName);
        console.log(crewLeader);
        return [crewLeader];
    }
}
