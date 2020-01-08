const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {

    createOne(callback, artistID, eventID) {
        super.query('INSERT INTO riderElement ', [artistID, eventID] , callback);
    }

    updateOne(callback, riderElementID, artistID, eventID) {
        super.query('UPDATE ', [riderElementID, artistID, eventID], callback);
    }
};