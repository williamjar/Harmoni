const Dao = require('./dao.js');

/**
 * @class contactDao
 * @classdesc A Database Access Object for contacts
 * @type {contactDao}
 * @see Dao
 */
module.exports = class contactDao extends Dao {

    /**
     * Get a contact
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}contactID
     * The ID of the contact.
     */
    getOne(callback, contactID) {
        super.query('SELECT * FROM contact WHERE contactID = ?', [contactID], callback);
    }

    /**
     * Create a contact
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [contactName,phone,email]
     */
    createOne(callback, list) {
        super.query('INSERT INTO contact (contactName, phone, email) values(?, ?, ?)', list, callback);
    }

    /**
     * Update a contact
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [contactName, phone, email]
     */
    updateOne(callback, list) {
        super.query('UPDATE contact SET contactName = ?,phone = ?,email = ? WHERE contactID = ?', list, callback);
    }

    /**
     * Delete a contact
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}contactID
     * The ID of the contact.
     */
    deleteOne(callback, contactID) {
        super.query('DELETE FROM contact where contactID = ?', [contactID], callback);
    }

    /**
     * Change the phone number of a contact
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [phone, organizerID]
     */
    changePhoneNumber(callback, list) {
        super.query('UPDATE contact SET phone = ? WHERE contactID = (SELECT organizer.contactID from organizer WHERE organizerID = ?)', list, callback)
    }
};

