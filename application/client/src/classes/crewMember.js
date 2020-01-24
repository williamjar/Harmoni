import {Contact} from "./contact";

/**
 * @classdesc Class used to store all the information fo a crew member
 */
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
        let crewMemberOne = new CrewMember(0, 'This lazy dude can only work every third sunday when theres a full moon',
            "Lazy work", super.getTestContacts()[3].contactName, super.getTestContacts()[3].phone, super.getTestContacts()[3].email,);

        return [crewMemberOne];
    }
}