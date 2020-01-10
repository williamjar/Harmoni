const Dao = require('./dao.js');

module.exports = class crewDao extends Dao {

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

    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM crew, contact WHERE organizerID = ? AND crew.contactID = contact.contactID', [organizerID], callback);
    }

    getAllForEvent(callback, eventID) {
        super.query('SELECT * FROM crew, contact, event_crewCategory_crew WHERE eventID = ? AND crew.crewID = event_crewCategory_crew.crewID AND crew.contactID = contact.contactID', [eventID], callback);
    }

    addDocument(callback, list) {
        super.query('INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (?, ?, ?, ?, ?)', list, callback);
    }

    setResponsible(callback, list) {
        super.query('UPDATE event_crewCategory_crew SET isResponsible = ? WHERE eventID = ? AND crewCategoryID = ? AND crewID = ?', list, callback);
    }

    getAllCategories(callback, organizerID) {
        super.query('SELECT * FROM crewCategory WHERE organizerID = ?', organizerID, callback);
    }

    createOneCategory(callback, list) {
        super.query('INSERT INTO crewCategory VALUES (DEFAULT, ?, ?)', list, callback);
    }

    deleteOneCategory(callback, crewCategoryID) {
        super.query('DELETE FROM crewCategory where crewCategoryID = ?', crewCategoryID, callback);
    }

    assignOne(callback, list) {
        super.query('INSERT INTO event_crewCategory_crew VALUES (?,?,?,?)', list, callback);
    }

    unAssignOne(callback, eventID, crewCategoryID, crewID) {
        super.query('DELETE FROM event_crewCategory_crew where eventID = ? AND crewCategoryID = ? AND crewID = ?', [eventID, crewCategoryID, crewID], callback);
    }

};