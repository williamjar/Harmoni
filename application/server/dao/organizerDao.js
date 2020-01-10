const Dao = require('./dao.js');

module.exports = class documentDao extends Dao {

    //TODO: Write SQL statements

    getOne(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN contact ON organizer.contactID = contact.contactID WHERE organizerID = ?', [organizerID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO organizer VALUES (default, ?, ?, default, ?)', list, callback);
    }

    changePassword(callback, list) {
        super.query('UPDATE organizer SET password = ? WHERE organizerID = ?', list, callback);
    }

    getAllDocuments(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN event ON organizer.organizerID = event.organizerID JOIN document ON organizer.organizerID = document.documentID WHERE organizer.organizerID = ?', [organizerID], callback);
    }

    getAllEvents(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN event ON organizer.organizerID = event.organizerID WHERE organizer.organizerID = ?', [organizerID], callback);

    }

};