const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {

    //TODO: Write SQL statements

    createOne(callback, artistID, eventID) {
        super.query('INSERT INTO riderElement VALUES (default, ?, ?, default, 0, default) ', [artistID, eventID] , callback);
    }

    //TODO: Needs more parameters
    updateOne(callback, riderElementID, artistID, eventID) {
        super.query('UPDATE ', [riderElementID, artistID, eventID], callback);
    }
};