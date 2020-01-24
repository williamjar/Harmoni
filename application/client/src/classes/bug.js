import {Organizer} from "./organizer";

/**
 * @classdesc Class used to store all the information needed to report a bug
 */
export class Bug{

    /**
     *
     * @param {int} bugID
     * The ID of the bug
     * @param {String} date
     * The date when the bug was registered
     * @param {String} description
     * The description describing the bug
     * @param {Organizer} organizer
     * The organizer (User) who reported the bug
     */
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