const Dao = require("./dao.js");

//Sql queries for associated with Documentation
/**
 * @classdesc Methods to contact db with execution commands
 * @class {documentationDao}
 * @type {documentationDao}
 * @see Dao
 */
module.exports = class documentationDao extends Dao {
    getAllDocumentCategories(callback){
        super.query(
            "select * from documentCategory",
            [],
            callback
        );
    }

    /**
     * Insert document to db
     * @function
     * @param {int} eventID - id to event
     * @param {string} documentName - name of document
     * @param {string} link - file path on server
     * @param {int} artistID - id of artist
     * @param {int} crewID - id of a crew member
     * @param {int} categoryID - id of a category
     */
    insertDocument(eventID, documentName, link, artistID, crewID, categoryID, callback){
        console.log("Inserting file on " + link);
        let val = [eventID, documentName, link, artistID, crewID, categoryID];
        console.log("val");
        console.log(val);
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink, artistID, crewID, documentCategoryID) VALUES (?,?,?,?,?,?)",
            val, callback
        );
    }

    /**
     * Get all documents from db
     * @param {int} eventID - id of event
     * @param {function} callback - handle response
     */
    getAllDocuments(eventID, callback){
        super.query(
            "select * from document where eventID = ?",
            [eventID],
            callback
        );
    }

    /**
     * Get all documents by category
     * @param {int} eventID - id of event
     * @param {int} documentCategoryID - id of document category
     * @param {function} callback - handle response
     */
    getDocumentsByCategory(eventID, documentCategoryID, callback){
        const val = [eventID, documentCategoryID];
        super.query(
            "select * from document where eventID = ? and documentCategoryID = ?",
            val,
            callback
        );
    }

    /**
     * Change category of document
     * @param {int} eventID - id of event
     * @param {int} documentCategoryID - id of document category
     * @param {object} json -
     * @param {function} callback - handle response
     */
    changeDocumentCategory(eventID, documentCategoryID, json, callback){
        const val = [eventID, documentCategoryID, json.documentID];
        super.query(
            "UPDATE document SET documentCategoryID = ? WHERE documentID = ? and eventID = ?",
            val,
            callback
        );
    }

    deleteOne(callback, documentID) {
        super.query('DELETE FROM document WHERE documentID = ? ', [documentID], callback);
    }

    /**
     * Delete a document
     * @param {int} eventID - id of event
     * @param {int} documentID - id of document
     * @param {function} callback - handle response
     */
    deleteDocument(eventID, documentID, callback){
        const val = [eventID, documentID];
        super.query(
            "delete from document where eventID = ? and documentID = ?;",
            val,
            callback
        );
    }

    /**
     * Get all document categories for event
     * @param {int} eventID - id of event
     * @param {function} callback - handle response
     */
    getAllDocumentCategoriesForEvent(eventID, callback){
        const val = [eventID];
        super.query("SELECT DISTINCT documentCategory.documentCategoryID, documentCategory.documentCategoryName from documentCategory left join document on documentCategory.documentCategoryID = document.documentCategoryID where document.eventID = ?",
            val, callback);
    }


    /**
     * Get all documents by category for event
     * @param {int} eventID - id of event
     * @param {int} documentCategoryID - id of document category
     * @param {function} callback - handle response
     */
    getAllDocumentsByCategoryForEvent(eventID,documentCategoryID, callback){
        const val = [eventID, documentCategoryID];
        super.query("SELECT * from document where eventID = ? and documentCategoryID = ?",
            val, callback);
    }

    /**
     * Get all documents for artist
     * @param {int} eventID - id of event
     * @param {int} artistID - id of artist
     * @param {function} callback - handle response
     */
    getDocumentsForArtist(eventID, artistID, callback){
        super.query("SELECT * FROM document where eventID = ? and artistID = ?", [eventID, artistID], callback);
    }

    /**
     * Get contact info of artist connected to document
     * @param {int} documentID - id of document
     * @param {function} callback - handle response
     */
    getArtistInfoConnectedToDocument(documentID, callback){
        const val = [documentID];
        super.query("SELECT contact.contactID, contact.contactName, contact.phone, contact.email from contact join artist on contact.contactID = artist.contactID join document on artist.artistID = document.artistID where document.documentID = ?",
            val, callback);
    }

    /**
     * Get contact info of crew member connected to document
     * @param {int} documentID - id of document
     * @param {function} callback - handle response
     */
    getCrewInfoConnectedToDocument(documentID, callback){
        const val = [documentID];
        super.query("SELECT contact.contactID, contact.contactName, contact.phone, contact.email from contact join crew on contact.contactID = crew.contactID join document on crew.crewID = document.crewID where document.documentID = ?",
            val, callback);
    }
};
