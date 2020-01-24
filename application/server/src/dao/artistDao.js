const Dao = require('./dao.js');

/**
 * A Database Access Object for artists
 * @type {artistDao}
 */
module.exports = class artistDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM artist, contact WHERE artist.contactID = contact.contactID',  callback);
    }

    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM artist, contact WHERE organizerID = ? AND artist.contactID = contact.contactID ', [organizerID], callback);
    }

    getAllForEvent(callback, eventID) {
        super.query('SELECT * FROM artist, contact, event_artist WHERE artist.contactID = contact.contactID  AND artist.artistID = event_artist.artistID AND event_artist.eventID = ?', [eventID], callback);
    }

    /**
     * Get an artist based on an input ID
     * @param {function} callback
     * gets passed on to the main DAO
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

    assignOne(callback, list) {
        super.query('INSERT INTO event_artist VALUES (?,?,0,0)', list, callback);
    }

    unAssignOne(callback, list) {
        super.query('DELETE FROM event_artist where eventID = ? AND artistID = ?', list, callback);
    }

    getAllGenres(callback){
        super.query('SELECT * FROM genre', null, callback);
    }

    getArtistEventInfo(callback, list){
        super.query('SELECT * FROM event_artist WHERE eventID = ? AND artistID = ?', list, callback);
    }

    updateArtistEventInfo(callback, list){
        super.query('UPDATE event_artist SET contractSigned = ?, hasBeenPaid = ? WHERE eventID = ? AND artistID = ?', list, callback);
    }



};