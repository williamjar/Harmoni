import {Organizer} from "./organizer";

export class Bug{
    constructor(bugID, bugDate, description, organizer){
        this.bugID = bugID;
        this.bugDate = bugDate;
        this.description = description;
        this.organizer = organizer;
    }

    static getTestBugs(){
        let bugOne = new Bug(0, '20200108', 'Stuff gone \'rong', Organizer.getTestOrganizer()[0]);
        let bugTwo = new Bug(1, '20200901', 'Other stuff gone \'rong', Organizer.getTestOrganizer()[0]);

        return [bugOne, bugTwo];
    }
}