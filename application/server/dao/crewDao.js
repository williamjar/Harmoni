const Dao = require('./dao.js');

module.exports = class crewDao extends Dao {

    //TODO: Write SQL statements

    createOne(callback, list) {
        super.query('INSERT INTO crew (crewID, description, contactID) values(?, ?, ?) ', list, callback);
    }

    updateOne(callback, crewID, description) {
        super.query('UPDATE crew set description = ? WHERE crewID = ? ', [crewID, description], callback);
    }

    getAllForOrganizer(callback, organizerID){
        super.query('SELECT * FROM crew, contact WHERE organizerID = ? AND crew.contactID = contact.contactID', [organizerID], callback);
    }

    getAllForEvent(callback, eventID){
        super.query('SELECT * FROM crew, contact, event_crewCategory_crew WHERE eventID = ? AND crew.crewID = event_crewCategory_crew.crewID AND crew.contactID = contact.contactID', [eventID], callback);
    }

    addDocument(callback, documentLink, crewID, documentCategoryID) {
        super.query('INSERT INTO document (documentLink, crewID, documentCategoryID) ', [documentLink, crewID, documentCategoryID], callback);
    }

    setResponsible(callback, crewID, isResponsible){
        super.query('UPDATE event_crewCategory_crew set isResponsible = ? WHERE crewID = ? ', [crewID, isResponsible], callback);
    }
};