class CrewMember extends Contact{

    crewCategories;

    constructor(crewID, name, phone, email, description){
        super(name, phone, email);
        this.crewID = crewID;
        this.description = description;
    }

    addCrewCategory(category){
        this.crewCategories.add(category);
    }

    static getTestCrewMember(){
        let crewMemberOne = new CrewMember(0,
            super.getTestContact()[3].contactName, super.getTestContact()[3].phone, super.getTestContact()[3].email,
            'This lazy dude can only work every third sunday when theres a full moon');
        crewMemberOne.addCrewCategory('Lazy work');

        return [crewMemberOne];
    }
}