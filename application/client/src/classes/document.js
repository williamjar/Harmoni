export class Document{
    constructor(documentID, documentLink, documentCategory){
        this.documentID = documentID;
        this.documentLink = documentLink;
        this.documentCategory = documentCategory;
    }

    static getTestDocuments(){
        let documentOne = new Document(0, 'artistContract.pdf', 'Contracts');
        let documentTwo = new Document(1, 'rider.pdf', 'Riders');
        let documentThree = new Document(2, 'crewContract', 'Contracts');
        return [documentOne, documentTwo, documentThree];
    }
}