import {Organizer} from "./organizer";

export class Bug{
    constructor(bugID, date, description, organizer){
        this.bugID = bugID;
        this.date = date;
        this.description = description;
        this.organizerID = organizer;
    }

    static getTestBugs(){
        let bugOne = new Bug(0, '20200108', 'Stuff gone \'rong', Organizer.getTestOrganizer()[0]);
        let bugTwo = new Bug(1, '20200901', 'Other stuff gone \'rong', Organizer.getTestOrganizer()[0]);

        return [bugOne, bugTwo];
    }
}