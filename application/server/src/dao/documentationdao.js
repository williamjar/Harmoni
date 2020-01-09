const Dao = require("./dao.js");

//Sql queries for associated with Documentation
module.exports = class test extends Dao {
    getAllDocumentCategories(callback){
        super.query(
            "select documentCategoryName from documentCategory",
            [],
            callback
        );
    }

    getAllDocuments(callback){
        super.query(
            "select * from document",
            [],
            callback
        );
    }

    insertDocument(id, json,callback) {
        var val = [id, json.documentName, json.documentLink, json.artistID, json.crewID, json.documentCategoryID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,artistID, crewID,documentCategoryID) VALUES (?, ?, ?, ?, ?, ?)",
            val,
            callback
        );
    }



};
