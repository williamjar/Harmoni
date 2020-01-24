const Dao = require("./dao.js");

//Sql queries for associated with Documentation
module.exports = class documentationDao extends Dao {
    getAllDocumentCategories(callback){
        super.query(
            "select * from documentCategory",
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


    getAllDocumentCategoriesForEvent(eventID, callback){
        var val = [eventID];
        super.query("SELECT DISTINCT documentCategory.documentCategoryID, documentCategory.documentCategoryName from documentCategory left join document on documentCategory.documentCategoryID = document.documentCategoryID where document.eventID = ?",
            val, callback);
    }



    getAllDocumentsByCategoryForEvent(eventID,documentCategoryID, callback){
        var val = [eventID, documentCategoryID];
        super.query("SELECT * from document where eventID = ? and documentCategoryID = ?",
            val, callback);
    }


    getDocumentsForArtist(eventID, artistID, callback){
        super.query("SELECT * FROM document where eventID = ? and artistID = ?", [eventID, artistID], callback);
    }

    getArtistInfoConnectedToDocument(documentID, callback){
        var val = [documentID];
        super.query("SELECT contact.contactID, contact.contactName, contact.phone, contact.email from contact join artist on contact.contactID = artist.contactID join document on artist.artistID = document.artistID where document.documentID = ?",
            val, callback);
    }

    getCrewInfoConnectedToDocument(documentID, callback){
        var val = [documentID];
        super.query("SELECT contact.contactID, contact.contactName, contact.phone, contact.email from contact join crew on contact.contactID = crew.contactID join document on crew.crewID = document.crewID where document.documentID = ?",
            val, callback);
    }
};
