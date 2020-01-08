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

    insertDocument(json,callback) {
        var val = [json.documentID, json.eventID, json.documentLink, json.artistID, json.documentCategoryID];
        super.query(
            "insert into news (documentID, eventID, documentLink, artistID, documentCategoryID) values (?,?,?,?,?)",
            val,
            callback
        );
    }

};
