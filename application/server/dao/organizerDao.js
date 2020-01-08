const Dao = require('./dao.js');

module.exports = class documentDao extends Dao {

    getOne(callback, organizerID) {
        super.query(' ', [organizerID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO organizer (username, password, pictureID, contactID) VALUES (?,?,?,?);', list, callback);
    }

    changePassword(callback, organizerID, password) {
        super.query('UPDATE organizer SET password = ? WHERE organizerID = ?', [organizerID, password], callback);
    }

};