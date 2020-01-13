const Dao = require("./dao.js");

//Sql queries for associated with Documentation
module.exports = class documentationDao extends Dao {
    getAllDocumentCategories(callback){
        super.query(
            "select documentCategoryName from documentCategory",
            [],
            callback
        );
    }

    getAllDocuments(eventID, callback){
        super.query(
            "select * from document where eventID = ?",
            [eventID],
            callback
        );
    }

    insertDocument(eventID, json, callback) {
        var val = [eventID, json.documentName, json.documentLink, json.documentCategoryID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,documentCategoryID) VALUES (?,?,?,?)",
            val,
            callback
        );
    }

    insertDocumentArtist(eventID, json,callback) {
        var val = [eventID, json.documentName, json.documentLink, json.artistID, json.documentCategoryID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (?,?,?,?,?)",
            val,
            callback
        );
    }

    insertDocumentCrew(eventID, json,callback) {
        var val = [eventID, json.documentName, json.documentLink, json.crewID, json.documentCategoryID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (?,?,?,?,?)",
            val,
            callback
        );
    }

    getOneDocument(eventID, documentID, callback){
        var val = [eventID, documentID];
        super.query(
            "select * from document where eventID = ? and documentID = ?",
            val,
            callback
        );
    }

    getDocumentsByCategory(eventID, documentCategoryID, callback){
        var val = [eventID, documentCategoryID];
        super.query(
            "select * from document where eventID = ? and documentCategoryID = ?",
            val,
            callback
        );
    }

    changeDocumentCategory(eventID, documentCategoryID, json, callback){
        var val = [eventID, documentCategoryID, json.documentID];
        super.query(
            "UPDATE document SET documentCategoryID = ? WHERE documentID = ? and eventID = ?",
            val,
            callback
        );
    }

    deleteDocument(eventID, documentID, callback){
        var val = [eventID, documentID];
        super.query(
            "delete from document where eventID = ? and documentID = ?;",
            val,
            callback
        );
    }
};
