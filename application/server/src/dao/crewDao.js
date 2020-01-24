const Dao = require('./dao.js');

/**
 * @class crewDao
 * @classdesc A Database Access Object for crew
 * @type {crewDao}
 * @see Dao
 */
module.exports = class crewDao extends Dao {

    /**
     * Get a crew member
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [crewID]
     */
    getOne(callback, list) {
        super.query('SELECT * FROM crew JOIN contact ON crew.contactID = contact.contactID WHERE crewID = ?', list, callback);
    }

    /**
     * Create a crew member
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [crewID, description, organizerID, contactID]
     */
    createOne(callback, list) {
        super.query('INSERT INTO crew (crewID, description, organizerID, contactID) values(DEFAULT , ?, ?, ?) ', list, callback);
    }

    /**
     * Update a crew member
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [description, crewID]
     */
    updateOne(callback, list) {
        super.query('UPDATE crew SET description = ?  WHERE crewID = ? ', list, callback);
    }

    /**
     * Update the information for a crew member relating to an event
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [isResponsible, contractSigned, hasBeenPaid, crewCategoryID, eventID, crewID]
     */
    updateOneForEvent(callback, list){
        super.query('UPDATE event_crewCategory_crew SET isResponsible = ?, contractSigned = ?, hasBeenPaid = ?, crewCategoryID = ? WHERE eventID = ? AND crewID = ?', list, callback);
    }

    /**
     * Delete a crew member
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}contactID
     * The contact ID of the crew member.
     */
    deleteOne(callback, contactID) {
        super.query('DELETE FROM contact WHERE contactID = ?', [contactID], callback);
    }

    /**
     * Gett all crew members for an organizer
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID for the organizer.
     */
    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM crew JOIN contact ON crew.contactID = contact.contactID WHERE crew.organizerID = ?', [organizerID], callback);
    }

    /**
     *
     * @param {function} callback
     * gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID,documentName,documentLink,crewID,documentCategoryID]
     */
    addDocument(callback, list) {
        super.query('INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (?, ?, ?, ?, ?)', list, callback);
    }

    /**
     * Get all crew categories for an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID for the event
     */
    getAllCategoriesForEvent(callback, eventID){
        super.query('SELECT DISTINCT crewCategory.crewCategoryID, crewCategoryName FROM crewCategory JOIN event_crewCategory_crew on crewCategory.crewCategoryID = event_crewCategory_crew.crewCategoryID WHERE eventID = ? ', [eventID], callback)
    }

    /**
     * Get all crew categories for an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID for the organizer.
     */
    getAllCategories(callback, organizerID) {
        super.query('SELECT * FROM crewCategory WHERE organizerID = ?', organizerID, callback);
    }

    /**
     * Get all crew for an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID]
     */
    getAllForEvent(callback, list) {
        super.query('SELECT DISTINCT * FROM crew JOIN contact ON crew.contactID = contact.contactID JOIN event_crewCategory_crew ON crew.crewID = event_crewCategory_crew.crewID JOIN crewCategory ON event_crewCategory_crew.crewCategoryID = crewCategory.crewCategoryID WHERE event_crewCategory_crew.eventID = ?', list, callback);
    }

    /**
     * Create a crew category
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [crewCategoryName, OrganizerID]
     */
    createOneCategory(callback, list) {
        super.query('INSERT INTO crewCategory VALUES (DEFAULT, ?, ?)', list, callback);
    }

    /**
     * Delete a crew category
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}crewCategoryID
     * The ID of the crew category
     */
    deleteOneCategory(callback, crewCategoryID) {
        super.query('DELETE FROM crewCategory where crewCategoryID = ?', crewCategoryID, callback);
    }

    /**
     * Assign a crew to a crew category
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventID, crewCategoryID, crewID, isResponsible, contractSigned, hasBeenPaid]
     */
    assignOne(callback, list) {
        super.query('INSERT INTO event_crewCategory_crew VALUES (?,?,?,?,?,?)', list, callback);
    }

    /**
     * Remove a crew from a crew category
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     * @param {int}crewCategoryID
     * The ID of the crew category.
     * @param {int}crewID
     * The ID of the crew member.
     */
    unAssignOne(callback, eventID, crewCategoryID, crewID) {
        super.query('DELETE FROM event_crewCategory_crew where eventID = ? AND crewCategoryID = ? AND crewID = ?', [eventID, crewCategoryID, crewID], callback);
    }


};

