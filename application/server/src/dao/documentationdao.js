const Dao = require("./dao.js");


//Sql queries for associated with Documentation
module.exports = class test extends Dao {
    getAllDocumentCategories(json, callback){
        super.query(
            "select documentCategoryID from documentCategory",
            [],
            callback
        );
    }

    getAllDocuments(json, callback){
        super.query(
            "select * from document",
            [],
            callback
        );
    }

    insertDocument(json,callback) {
        var val = [json.documentID, json.eventID, json.documentLink, json.artistID, json.documentCategoryID];
        super.query(
            "insert into news (documentID, eventID, documentLink, artistID, documentCategoryID) values (?,?,?,?,?)",
            val,
            callback
        );
    }

    insertDocumentLink(json, callback) {
        var val = [json.documentLink, json.documentID];
        super.query("UPDATE document SET documentLink = ? WHERE documentID = ?",
            val,
            callback
        );
    }
};
