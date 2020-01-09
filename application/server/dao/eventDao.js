const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM event', [], callback);
    }

    getOne(callback, eventID) {
        super.query('SELECT * FROM event WHERE eventID = ?', [eventID], callback);
    }

    getByStatusForOrganizer(callback, status, organizerID) {
        super.query('SELECT * FROM event WHERE status = ? AND organizerID = ?', [status, organizerID], callback);
    }

    deleteOne(callback, eventID) {
        super.query('DELETE FROM event WHERE eventID = ?', [eventID], callback);
    }

    publishOne(callback, eventID) {
        super.query('UPDATE event SET status = 1 WHERE eventID = ?', [eventID], callback);
    }

    ArchiveOne(callback, eventID) {
        super.query('UPDATE event SET status = 0 WHERE eventID = ?', [eventID], callback);
    }

    getNumberArchived(callback) {
        super.query('SELECT COUNT(*) FROM event WHERE status = 2', [], callback);
    }

    getXArchivedAfterDate(callback, x, date){
        super.query('SELECT * FROM event WHERE publishDate < ? LIMIT ?', [date, x], callback);
    }

    getAllArtists(callback, eventID) {
        super.query('SELECT * FROM event_artist JOIN artist ON event_artist.artistID = artist.artistID JOIN contact ON artist.contactID = contact.contactID WHERE event_artist.eventID = ?', [eventID], callback);
    }

    addDocument(callback, eventID, documentID) {
        super.query('INSERT INTO document VALUES (DEFAULT, ?, ?, ?, NULL, NULL, ?, documentCategoryID)', [eventID, documentID], callback);
    }
};