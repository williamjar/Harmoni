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

    insertDocumentArtist(eventID, category, req, artistID, callback){
        var val = [eventID, req.originalname, req.path, category, artistID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,documentCategoryID, artistID) VALUES (?,?,?,?,?)",
            val, callback
        );
    }

    insertDocumentCrew(eventID, category, req, crewID, callback){
        var val = [eventID, req.originalname, req.path, category, crewID];
        super.query(
            "INSERT INTO document (eventID,documentName,documentLink,documentCategoryID, crewID) VALUES (?,?,?,?,?)",
            val, callback
        );
    }


    getAllDocuments(eventID, callback){
        super.query(
            "select * from document where eventID = ?",
            [eventID],
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

    getDocumentsForArtist(eventID, artistID, callback){
        super.query("SELECT * FROM document where eventID = ? and artistID = ?", [eventID, artistID], callback);
    }
};
