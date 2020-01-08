class Bug{
    constructor(bugID, bugDate, description, organizer){
        this.bugID = bugID;
        this.bugDate = bugDate;
        this.description = description;
        this.organizer = organizer;
    }

    getTestBugs(){
        let contactOne = new Contact('Organizer One', '00 00 12 34', 'mail@organisasjon.no');
        let organizer = new Organizer(0, contactOne.contactName, contactOne.phone, contactOne.email, 'Organizer', 'img.png');
        let bugOne = new Bug(0, '20200108', 'Stuff gone \'rong', organizer);
        let bugTwo = new Bug(1, '20200901', 'Other stuff gone \'rong', organizer);

        return [bugOne, bugTwo];
    }
}