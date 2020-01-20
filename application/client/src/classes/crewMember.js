import {Contact} from "./contact";

export class CrewMember extends Contact {

    constructor(crewID, contactID, description, crewCategory, contactName, phone, email, isResponsible) {
        super(contactID, contactName, phone, email);
        this.crewID = crewID;
        this.description = description;
        this.crewCategory = crewCategory;
        this.isResponsible = isResponsible;
    }

    addCrewCategory(category) {
        this.crewCategories.push(category);
    }

    static getTestCrewMember() {
        let crewMemberOne = new CrewMember(0,
            super.getTestContacts()[3].contactName, super.getTestContacts()[3].phone, super.getTestContacts()[3].email,
            'This lazy dude can only work every third sunday when theres a full moon');
        crewMemberOne.addCrewCategory('Lazy work');

        return [crewMemberOne];
    }
}