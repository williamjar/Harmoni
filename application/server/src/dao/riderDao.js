const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {

    getOne(callback, riderElementID){
        super.query('SELECT * FROM riderElement WHERE riderElementID = ?', [riderElementID], callback);
    }

    getAllRidersForArtist(callback, artistID){
        super.query('SELECT * FROM riderElement WHERE artistID = ?', [artistID], callback);
    }

    getAllRidersForArtistForEvent(callback, artistID, eventID){
        super.query('SELECT * FROM riderElement WHERE artistID = ? AND eventID = ?', [artistID, eventID], callback);
    }

    getAllRidersForEvent(callback, eventID){
        super.query('SELECT * FROM riderElement WHERE eventID = ?', [eventID], callback);
    }

    createOne(callback, list) {
        console.log(list);
        super.query('INSERT INTO riderElement VALUES (default, ?, ?, default, 0, ?)', list, callback);
    }

    updateOne(callback, list) {
        super.query('UPDATE riderElement SET status = ?, isDone = ?, description = ? WHERE riderElementID = ? AND artistID = ? AND eventID = ?' , list, callback);
    }

    deleteOne(callback, riderElementID, artistID, eventID) {
        super.query('DELETE FROM riderElement WHERE riderElementID = ? AND artistID = ? AND eventID = ?', [riderElementID, artistID, eventID], callback);
    }
};