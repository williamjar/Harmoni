const Dao = require('./dao.js');

/**
 * @class organizerDao
 * @classdesc A Database Access Object for organizer
 * @type {organizerDao}
 * @see Dao
 */
module.exports = class organizerDao extends Dao {

    /**
     * Get an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer.
     */
    getOne(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN contact ON organizer.contactID = contact.contactID LEFT JOIN picture ON organizer.pictureID = picture.pictureID WHERE organizerID = ?', [organizerID], callback);
    }

    /**
     * Create an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [username, password (should be salted hashed and salted first), contactID]
     */
    createOne(callback, list) {
        super.query('INSERT INTO organizer VALUES (default, ?, ?, default, ?)', list, callback);
    }

    /**
     * Change the password for an organizer.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [password (should be salted hashed and salted first), organizerID]
     */
    changePassword(callback, list) {
        super.query('UPDATE organizer SET password = ? WHERE organizerID = ?', list, callback);
    }

    /**
     * Get all documents for an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID for the organizer.
     */
    getAllDocuments(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN event ON organizer.organizerID = event.organizerID JOIN document ON organizer.organizerID = document.documentID WHERE organizer.organizerID = ?', [organizerID], callback);
    }

    /**
     * Get all events for an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer.
     */
    getAllEvents(callback, organizerID) {
        super.query('SELECT * FROM organizer JOIN event ON organizer.organizerID = event.organizerID WHERE organizer.organizerID = ?', [organizerID], callback);
    }

    /**
     * Change the username for an organizer
     * @param {Array}list
     * List of parameters [username, organizerID]
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    changeUsername(list, callback) {
        super.query('UPDATE organizer SET username = ? WHERE organizerID = ?', list, callback)
    }

    /**
     * Get the ID of an organizer by their email
     * @param {String}email
     * The email to search with.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getOrganizerFromEmail(email, callback) {
        super.query("select organizer.organizerID from organizer join contact c on organizer.contactID = c.contactID where c.email = ?", [email], callback);
    }

    /**
     * Change the picture of an organizer.
     * @param {int}pictureID
     * The ID of the new picture
     * @param {int}organizerID
     * The ID of the organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    changePicture(pictureID, organizerID, callback){
        super.query("UPDATE organizer SET pictureID = ? where organizerID = ?", [pictureID, organizerID], callback);
    }

};
