export class Document{
    constructor(documentID, eventID, documentName, documentLink, artistID, crewID, documentCategoryID){
        this.documentID = documentID;
        this.eventID = eventID;
        this.documentName = documentName;
        this.documentLink = documentLink;
        this.artistID = artistID;
        this.crewID = crewID;
        this.documentCategoryID = documentCategoryID;
    }

    static getTestDocuments(){
        let documentOne = new Document(0, 1,'artistContract.pdf',"Link here", null, null, 1);
        let documentTwo = new Document(1, 2,'test.pdf',"Link here", null, 1, 2);
        let documentThree = new Document(2, 3,'fan.pdf',"Link here", 1, null, 3);
        return [documentOne, documentTwo, documentThree];
    }
}