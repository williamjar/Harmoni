const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM event', [], callback);
    }

    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM event WHERE organizerID = ?', [organizerID], callback);
    }

    getOne(callback, eventID) {
        super.query('SELECT * FROM event LEFT JOIN eventType ON event.eventTypeID = eventType.eventTypeID WHERE eventID = ?', [eventID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO event VALUES (DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', list, callback);
    }

    updateOne(callback, list) {
        super.query('UPDATE event SET eventName = ?, startDate = ?, endDate = ?, startTime = ?, endTime = ?, address = ?, town = ?, zipCode = ?, status = ?, description = ?, publishDate = ?, publishTime = ?, eventTypeID = ?, pictureID = ? WHERE eventID = ?', list, callback);
    }

    getByStatusForOrganizer(callback, status, organizerID) {
        super.query('SELECT * FROM event WHERE status = ? AND organizerID = ?', [status, organizerID], callback);
    }

    deleteOne(callback, eventID) {
        super.query('DELETE FROM event WHERE eventID = ?', [eventID], callback);
    }

    setStatus(callback, eventID, status) {
        super.query('UPDATE event SET status = ? WHERE eventID = ?', [status, eventID], callback);
    }

    getNumberOfStatusForOrganizer(callback, status, organizerID) {
        super.query('SELECT COUNT(*) FROM event WHERE status = ? AND organizerID = ?', [status, organizerID], callback);
    }

    getXOfStatusAfterDateForOrganizer(callback, status, x, date, organizerID) {
        super.query('SELECT * FROM event WHERE status = ? AND publishDate < ? AND organizerID = ? LIMIT ?', [status, date, organizerID, x], callback);
    }

    getAllArtists(callback, eventID) {
        super.query('SELECT * FROM event_artist JOIN artist ON event_artist.artistID = artist.artistID JOIN contact ON artist.contactID = contact.contactID WHERE event_artist.eventID = ?', [eventID], callback);
    }

    addDocument(callback, eventID, documentID) {
        super.query('UPDATE document SET eventID = ? WHERE documentID = ?', [eventID, documentID], callback);
    }

    getAllDocuments(callback, eventID) {
        super.query('SELECT * FROM document WHERE eventID = ?', [eventID], callback);
    }

    archiveOldEvents(callback, organizerID) {
        super.query('UPDATE event SET status = 2 WHERE organizerID = ? AND status = 1 AND (endDate <= CURRENT_DATE() OR endDate = CURRENT_DATE() AND endTime < CURRENT_TIME())', [organizerID], callback);
    }

    getAllEventTypes(callback) {
        super.query('SELECT * FROM eventType', [], callback);
    }

    changePicture(pictureID, eventID, callback){
        super.query("UPDATE event SET pictureID = ? where eventID = ?", [pictureID, eventID], callback);
    }
};