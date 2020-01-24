const Dao = require('./dao.js');

/**
 * @class artistDao
 * @classdesc A Database Access Object for artists
 * @type {artistDao}
 * @see Dao
 */
module.exports = class artistDao extends Dao {

    /**
     * Get all artists
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getAll(callback) {
        super.query('SELECT * FROM artist, contact WHERE artist.contactID = contact.contactID',  callback);
    }

    /**
     * Get all artists for an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer
     */
    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM artist, contact WHERE organizerID = ? AND artist.contactID = contact.contactID ', [organizerID], callback);
    }

    /**
     * Get all artists an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getAllForEvent(callback, eventID) {
        super.query('SELECT * FROM artist, contact, event_artist WHERE artist.contactID = contact.contactID  AND artist.artistID = event_artist.artistID AND event_artist.eventID = ?', [eventID], callback);
    }

    /**
     * Get an artist based on an input ID
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}artistID
     * The ID of the artist.
     */

    getOne(callback, artistID) {
        super.query('SELECT * FROM artist JOIN organizer ON artist.organizerID = organizer.organizerID JOIN contact ON artist.contactID = contact.contactID JOIN genre ON artist.genreID = genre.genreID WHERE artistID = ?', [artistID], callback);
    }

    /**
     * Create one artist
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * list of parameters [genreID, organizerID, contactID]
     */
    createOne(callback, list) {
        console.log(list);
        super.query('INSERT INTO artist (genreID, organizerID, contactID) values(?, ?, ?)', list, callback);
    }

    /**
     * Update an artist
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * list of parameters [genreID]
     */
    updateOne(callback, list){
        super.query('UPDATE artist SET genreID = ? WHERE artistID = ?', list, callback);
    }

    /**
     * Delete an artist
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}contactID
     * The ID of the contactID of the artist
     */
    deleteOne(callback, contactID) {
        super.query('DELETE FROM contact WHERE contactID = ?', [contactID], callback);
    }

    /**
     * Add a document to an artist for an event (contract)
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID,documentName,documentLink,artistID,documentCategoryID]
     */
    addDocument(callback, list) {
        super.query('INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (?, ?, ?, ?, ?)', list, callback);
    }

    /**
     * Assign an artist to an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID, artistID].
     */
    assignOne(callback, list) {
        super.query('INSERT INTO event_artist VALUES (?,?,0,0)', list, callback);
    }

    /**
     * Remove an artist from an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID, artistID]
     */
    unAssignOne(callback, list) {
        super.query('DELETE FROM event_artist where eventID = ? AND artistID = ?', list, callback);
    }

    /**
     * Get all genres
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getAllGenres(callback){
        super.query('SELECT * FROM genre', null, callback);
    }

    /**
     * Get the information for an artist relating to an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID, artistID].
     */
    getArtistEventInfo(callback, list){
        super.query('SELECT * FROM event_artist WHERE eventID = ? AND artistID = ?', list, callback);
    }

    /**
     * Update The information for an artist relating to an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [contractSigned, hasBeenPaid, eventID, artistID].
     */
    updateArtistEventInfo(callback, list){
        super.query('UPDATE event_artist SET contractSigned = ?, hasBeenPaid = ? WHERE eventID = ? AND artistID = ?', list, callback);
    }



};