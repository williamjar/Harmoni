const Dao = require('./dao.js');

module.exports = class crewDao extends Dao {

    //TODO: Write SQL statements

    getOne(callback, list) {
        super.query('SELECT contactName,phone,email,organizerID,description FROM crew JOIN contact ON crew.contactID = contact.contactID WHERE crewID = ?', list, callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO crew (crewID, description, contactID) values(?, ?, ?) ', list, callback);
    }

    updateOne(callback, list) {
        super.query('UPDATE crew set description = ? WHERE crewID = ? ', list, callback);
    }

    deleteOne(callback, contactID) {
        super.query('DELETE FROM crew where crewID = ?', [contactID], callback);
    }

    getAllForOrganizer(callback, organizerID){
        super.query('SELECT * FROM crew, contact WHERE organizerID = ? AND crew.contactID = contact.contactID', [organizerID], callback);
    }

    getAllForEvent(callback, eventID){
        super.query('SELECT * FROM crew, contact, event_crewCategory_crew WHERE eventID = ? AND crew.crewID = event_crewCategory_crew.crewID AND crew.contactID = contact.contactID', [eventID], callback);
    }

    addDocument(callback, crewID, documentID) {
        super.query('INSERT INTO document VALUES (DEFAULT, ?, ?, ?, ?, NULL, ?, documentCategoryID)', [crewID, documentID], callback);
    }

    setResponsible(callback, eventID, crewID, crewCategoryID, responsible){
        super.query('UPDATE event_crewCategory_crew SET isResponsible = ? WHERE eventID = ? AND crewCategoryID = ? AND crewID = ?', [responsible, eventID, crewCategoryID, crewID], callback);
    }

    getAllCategories(callback){
        super.query('SELECT * FROM crewCategory', [], callback);
    }

    createOneCategory(callback, crewCategoryName, organizerID){
        super.query('INSERT INTO crewCategory VALUES (DEFAULT, ?, ?)', [crewCategoryName, organizerID], callback);
    }

};