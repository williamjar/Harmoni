/**
 * @classdesc Utility class for connecting a document category ID and the name of that category.
 */
export class DocumentCategory{

    /**
     *
     * @param {int}documentCategoryID
     * The ID of the document category.
     * @param {String}documentCategoryName
     * The name of the document category.
     */
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