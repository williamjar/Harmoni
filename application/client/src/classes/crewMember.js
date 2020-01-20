import {Contact} from "./contact";

export class CrewMember extends Contact{


    constructor(crewID, description, crewCategoryName, contactName, phone, email, isResponsible){
        super(contactName, phone, email);
        this.crewID = crewID;
        this.description = description;
        this.crewCategoryName = crewCategoryName;
        this.isResponsible = isResponsible;
    }

    addCrewCategory(category){
        this.crewCategories.push(category);
    }

    static getTestCrewMember(){
        let crewMemberOne = new CrewMember(0, 'This lazy dude can only work every third sunday when theres a full moon',
            "Lazy work", super.getTestContacts()[3].contactName, super.getTestContacts()[3].phone, super.getTestContacts()[3].email,);

        return [crewMemberOne];
    }
}