const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {

    createOne(callback, artistID, eventID) {
        super.query('INSERT INTO riderElement VALUES (default, ?, ?, default, 0, default) ', [artistID, eventID] , callback);
    }

    updateOne(callback, riderElement) {
        super.query('UPDATE riderElement SET status = ?, isDone = ?, description = ? WHERE riderElementID = ?' , [riderElement.status, riderElement.isDone, riderElement.description, riderElement.riderID], callback);
    }

    deleteOne(callback, riderElementID) {
        super.query('DELETE FROM riderElement WHERE riderElementID = ?', [riderElementID], callback);
    }
};