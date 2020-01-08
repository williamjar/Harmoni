const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {
    updateOne(callback, riderElementID, artistID, eventID) {
        super.query('UPDATE ', [riderElementID, artistID, eventID], callback);
    }
};