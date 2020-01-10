const Dao = require('./dao.js');

module.exports = class artistDao extends Dao {

    getAll(callback) {
        super.query('SELECT username,date,description FROM bug JOIN organizer ON bug.organizerID = organizer.organizerID JOIN contact ON organizer.contactID = contact.contactID', callback);
    }

    getOne(callback,organizerID) {
        super.query('SELECT username,date,description FROM bug JOIN organizer ON bug.organizerID = organizer.organizerID JOIN contact ON organizer.contactID = contact.contactID WHERE organizer.organizerID = ?',organizerID, callback);
    }

};
