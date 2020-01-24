const Dao = require('./dao.js');

/**
 * @class bugDao
 * @classdesc A Database Access Object for bugs
 * @type {bugDao}
 * @see Dao
 */
module.exports = class bugDao extends Dao {


    //Register bug
    /**
     * Register a bug
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * list of parameters [description , organizerID]
     */
    registerBug(callback, list){
        super.query('INSERT INTO bug (date , description , organizerID, resolved) VALUES (CURRENT_DATE, ?, ?, 0)', list , callback);
    }

    /**
     * Get all bugs reported by one user (organizer)
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer.
     */
    getAllBugsFromOrganizer(callback, organizerID){
        super.query('SELECT * FROM bug WHERE organizerID = ?', [organizerID], callback);
    }

    /**
     * Gat a bug
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}bugID
     * The ID of the bug.
     */
    getOneBug(callback, bugID){
        super.query('SELECT * FROM bug WHERE bugID = ?', [bugID], callback);
    }

    getAllBugs(callback) {
        super.query('SELECT * FROM bug', callback);
    }

    /**
     * Delete a bug
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}bugID
     * The ID of the bug.
     */
    deleteBug(callback, bugID) {
        super.query('DELETE FROM bug WHERE bugID = ?', [bugID], callback);
    }
};
