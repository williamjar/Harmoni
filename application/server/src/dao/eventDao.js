const Dao = require('./dao.js');

/**
 * @class eventDao
 * @classdesc A Database Access Object for event
 * @type {eventDao}
 * @see Dao
 */
module.exports = class eventDao extends Dao {

    /**
     * Get all events
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getAll(callback) {
        super.query('SELECT * FROM event', [], callback);
    }

    /**
     * Get all events associated with an organizer
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer.
     */
    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM event WHERE organizerID = ?', [organizerID], callback);
    }

    /**
     * Get one event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getOne(callback, eventID) {
        super.query('SELECT * FROM event LEFT JOIN eventType ON event.eventTypeID = eventType.eventTypeID WHERE eventID = ?', [eventID], callback);
    }

    /**
     * Create an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventName, startDate, endDate, startTime, endTime, address, town, zipCode, status, description, publishDate, publishTime]
     */
    createOne(callback, list) {
        super.query('INSERT INTO event VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', list, callback);
    }

    /**
     * Update an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [eventName, startDate, endDate, startTime, endTime, address, town, zipCodestatus, description, publishDate, publishTime, eventTypeID, pictureID, eventID]
     */
    updateOne(callback, list) {
        super.query('UPDATE event SET eventName = ?, startDate = ?, endDate = ?, startTime = ?, endTime = ?, address = ?, town = ?, zipCode = ?, status = ?, description = ?, publishDate = ?, publishTime = ?, eventTypeID = ?, pictureID = ? WHERE eventID = ?', list, callback);
    }

    /**
     * Get all events with a status
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}status
     * The ID for the status
     * @param {int}organizerID
     * The ID for the organizer
     */
    getByStatusForOrganizer(callback, status, organizerID) {
        super.query('SELECT * FROM event WHERE status = ? AND organizerID = ?', [status, organizerID], callback);
    }

    /**
     * Delete an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    deleteOne(callback, eventID) {
        super.query('DELETE FROM event WHERE eventID = ?', [eventID], callback);
    }

    /**
     * Set the status of an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     * @param {status}status
     * The status to be set (0 = under planning, 1 = published, 2 = archived, 3 = canceled).
     */
    setStatus(callback, eventID, status) {
        super.query('UPDATE event SET status = ? WHERE eventID = ?', [status, eventID], callback);
    }

    /**
     * Get the number of events with a status
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}status
     * The status to be searched for (0 = under planning, 1 = published, 2 = archived, 3 = canceled).
     * @param {int}organizerID
     * The ID of the organizer associated with the event.
     */
    getNumberOfStatusForOrganizer(callback, status, organizerID) {
        super.query('SELECT COUNT(*) FROM event WHERE status = ? AND organizerID = ?', [status, organizerID], callback);
    }

    /**
     * Get x amount of events with a status after an date.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}status
     * The status to be searched for (0 = under planning, 1 = published, 2 = archived, 3 = canceled).
     * @param {int}x
     * The number of events to return. (If there exists less than x events, all events will be returned).
     * @param {string}date
     * The date used for the search (yyyy-mm-dd).
     * @param {int}organizerID
     * The ID of the organizer associated with the events.
     */
    getXOfStatusAfterDateForOrganizer(callback, status, x, date, organizerID) {
        super.query('SELECT * FROM event WHERE status = ? AND publishDate < ? AND organizerID = ? LIMIT ?', [status, date, organizerID, x], callback);
    }

    /**
     * Get all artists for an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getAllArtists(callback, eventID) {
        super.query('SELECT * FROM event_artist JOIN artist ON event_artist.artistID = artist.artistID JOIN contact ON artist.contactID = contact.contactID WHERE event_artist.eventID = ?', [eventID], callback);
    }

    /**
     * Add a document to an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     * @param {int}documentID
     * The ID of the document.
     */
    addDocument(callback, eventID, documentID) {
        super.query('UPDATE document SET eventID = ? WHERE documentID = ?', [eventID, documentID], callback);
    }

    /**
     * Get all documents for an event.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getAllDocuments(callback, eventID) {
        super.query('SELECT * FROM document WHERE eventID = ?', [eventID], callback);
    }

    /**
     * Archive all events where their end date is before the current date.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}organizerID
     * The ID of the organizer associated with the events.
     */
    archiveOldEvents(callback, organizerID) {
        super.query('UPDATE event SET status = 2 WHERE organizerID = ? AND status = 1 AND (endDate <= CURRENT_DATE() OR endDate = CURRENT_DATE() AND endTime < CURRENT_TIME())', [organizerID], callback);
    }

    /**
     * Get all event types
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getAllEventTypes(callback) {
        super.query('SELECT * FROM eventType', [], callback);
    }

    /**
     * Change the picture for an event
     * @param {int}pictureID
     * The ID of the new picture.
     * @param {int}eventID
     * The ID of the event.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    changePicture(pictureID, eventID, callback){
        super.query("UPDATE event SET pictureID = ? where eventID = ?", [pictureID, eventID], callback);
    }
};

