export class DocumentCategory{
    constructor(documentCategoryID, documentCategoryName){
        this.documentCategoryID = documentCategoryID;
        this.documentCategoryName = documentCategoryName;
    }

    static getTestDocuments(){
        let documentOne = new DocumentCategory(0, 'Contracts');
        let documentTwo = new DocumentCategory(1, 'Riders');
        let documentThree = new DocumentCategory(2, 'Contracts');
        return [documentOne, documentTwo, documentThree];
    }
}