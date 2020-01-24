import {CrewMember} from "./crewMember";

/**
 * @deprecated This class is no longer in use, as it's utility has been consolidated in crewMember
 * @see CrewMember
 */
export class CrewLeader extends CrewMember{
    constructor(crewID, name, phone, email, description, crewCategory){
        super(crewID, name, phone, email, description, true);
        this.crewCategory = crewCategory;
    }

    static getTestCrewLeader(){
        let crewLeader = new CrewLeader(super.getTestCrewMember()[0].crewID,
            super.getTestCrewMember()[0].contactName,
            super.getTestCrewMember()[0].phone,
            super.getTestCrewMember()[0].email,
            super.getTestCrewMember()[0].description,
            super.getTestCrewMember()[0].crewCategories[0]);
        return [crewLeader];
    }
}
