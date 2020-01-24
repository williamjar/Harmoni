const Dao = require('./dao.js');

module.exports = class crewDao extends Dao {

    getOne(callback, list) {
        super.query('SELECT * FROM crew JOIN contact ON crew.contactID = contact.contactID WHERE crewID = ?', list, callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO crew (crewID, description, organizerID, contactID) values(DEFAULT , ?, ?, ?) ', list, callback);
    }

    updateOne(callback, list) {
        super.query('UPDATE crew SET description = ?  WHERE crewID = ? ', list, callback);
    }

    updateOneForEvent(callback, list){
        super.query('UPDATE event_crewCategory_crew SET isResponsible = ?, contractSigned = ?, hasBeenPaid = ?, crewCategoryID = ? WHERE eventID = ? AND crewID = ?', list, callback);
    }

    deleteOne(callback, contactID) {
        super.query('DELETE FROM contact WHERE contactID = ?', [contactID], callback);
    }

    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM crew JOIN contact ON crew.contactID = contact.contactID WHERE crew.organizerID = ?', [organizerID], callback);
    }

    addDocument(callback, list) {
        super.query('INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (?, ?, ?, ?, ?)', list, callback);
    }

    getAllCategoriesForEvent(callback, eventID){
        super.query('SELECT DISTINCT crewCategory.crewCategoryID, crewCategoryName FROM crewCategory JOIN event_crewCategory_crew on crewCategory.crewCategoryID = event_crewCategory_crew.crewCategoryID WHERE eventID = ? ', [eventID], callback)
    }

    getAllCategories(callback, organizerID) {
        super.query('SELECT * FROM crewCategory WHERE organizerID = ?', organizerID, callback);
    }

    getAllForEvent(callback, list) {
        super.query('SELECT DISTINCT * FROM crew JOIN contact ON crew.contactID = contact.contactID JOIN event_crewCategory_crew ON crew.crewID = event_crewCategory_crew.crewID JOIN crewCategory ON event_crewCategory_crew.crewCategoryID = crewCategory.crewCategoryID WHERE event_crewCategory_crew.eventID = ?', list, callback);
    }

    createOneCategory(callback, list) {
        super.query('INSERT INTO crewCategory VALUES (DEFAULT, ?, ?)', list, callback);
    }

    deleteOneCategory(callback, crewCategoryID) {
        super.query('DELETE FROM crewCategory where crewCategoryID = ?', crewCategoryID, callback);
    }

    assignOne(callback, list) {
        super.query('INSERT INTO event_crewCategory_crew VALUES (?,?,?,?,?,?)', list, callback);
    }

    unAssignOne(callback, eventID, crewCategoryID, crewID) {
        super.query('DELETE FROM event_crewCategory_crew where eventID = ? AND crewCategoryID = ? AND crewID = ?', [eventID, crewCategoryID, crewID], callback);
    }


};

