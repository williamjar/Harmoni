import {Contact} from "./contact";

export class CrewMember extends Contact {


    constructor(crewID, contactID, description, crewCategoryID, crewCategoryName, contactName, phone, email, isResponsible, contractSigned, hasBeenPaid){
        super(contactID, contactName, phone, email);
        this.crewID = crewID;
        this.description = description;
        this.crewCategoryID = crewCategoryID;
        this.crewCategoryName = crewCategoryName;
        this.isResponsible = isResponsible;
        this.contractSigned = contractSigned;
        this.hasBeenPaid = hasBeenPaid;
    }
/*
    addCrewCategory(category) {
        this.crewCategories.push(category);
    }*/

    static getTestCrewMember(){
        let crewMemberOne = new CrewMember(0, super.getTestContacts()[3].contactID, 'This lazy dude can only work every third sunday when theres a full moon',
            0, "Lazy work", super.getTestContacts()[3].contactName, super.getTestContacts()[3].phone, super.getTestContacts()[3].email, false, false, false);
        return [crewMemberOne];
    }
}