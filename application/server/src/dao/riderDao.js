const Dao = require('./dao.js');

/**
 * @class riderDao
 * @classdesc A Database Access Object for rider.
 * @type {riderDao}
 * @see Dao
 */
module.exports = class riderDao extends Dao {

    /**
     * Get a rider
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}riderElementID
     * The ID of the rider.
     */
    getOne(callback, riderElementID){
        super.query('SELECT * FROM riderElement WHERE riderElementID = ?', [riderElementID], callback);
    }

    /**
     * Get all riders for an artist
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}artistID
     * The ID of the artist associated with the riders.
     */
    getAllRidersForArtist(callback, artistID){
        super.query('SELECT * FROM riderElement WHERE artistID = ?', [artistID], callback);
    }

    /**
     * Get all riders for an artist for an event.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}artistID
     * The ID of the artist.
     * @param {int}eventID
     * The ID of the event.
     */
    getAllRidersForArtistForEvent(callback, artistID, eventID){
        super.query('SELECT * FROM riderElement WHERE artistID = ? AND eventID = ?', [artistID, eventID], callback);
    }

    /**
     * Get all riders for an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getAllRidersForEvent(callback, eventID){
        super.query('SELECT * FROM riderElement WHERE eventID = ?', [eventID], callback);
    }

    /**
     * Create a rider
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [artistID, eventID, description].
     */
    createOne(callback, list) {
        console.log(list);
        super.query('INSERT INTO riderElement VALUES (default, ?, ?, default, 0, ?)', list, callback);
    }

    /**
     * Update a rider
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [status, isDone, description, riderElementID, artistID, eventID].
     */
    updateOne(callback, list) {
        super.query('UPDATE riderElement SET status = ?, isDone = ?, description = ? WHERE riderElementID = ? AND artistID = ? AND eventID = ?' , list, callback);
    }

    /**
     * Delete a rider
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}riderElementID
     * The ID of the rider.
     * @param {int}artistID
     * The ID of the artist.
     * @param {int}eventID
     * The ID of the event.
     */
    deleteOne(callback, riderElementID, artistID, eventID) {
        super.query('DELETE FROM riderElement WHERE riderElementID = ? AND artistID = ? AND eventID = ?', [riderElementID, artistID, eventID], callback);
    }
};

