const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM event', [], callback);
    }

    getOne(callback, eventID) {
        super.query('SELECT * FROM event WHERE eventID = ?', [eventID], callback);
    }

    getByStatus(callback, status) {
        super.query('SELECT * FROM event WHERE status = ?', [status], callback);
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

    getAllPublished(callback) {
        super.query('SELECT * FROM event WHERE status = 1', [], callback);
    }

    getAllPlanned(callback) {
        super.query('SELECT * FROM event WHERE status = 0', [], callback);
    }

    getAllArchived(callback){
        super.query('SELECT * FROM event WHERE status = 2', [], callback);
    }

    getNumberArchived(callback) {
        super.query('SELECT COUNT(*) FROM event WHERE status = 2', [], callback);
    }

    getXArchivedAfterDate(callback, x, date){
        super.query('SELECT * FROM event WHERE publishDate < ? LIMIT ?', [date, x], callback);
    }

    getAllArtists(callback, eventID) {
        super.query('SELECT * FROM event_artist, artist, contact WHERE eventID = ? AND event_artist = artist.artistID AND artist.contactID = contact.contactID', [eventID], callback);
    }

    addDocument(callback, eventID, documentID) {
        super.query('INSERT INTO document VALUES (DEFAULT, ?, ?, ?, NULL, NULL, ?, documentCategoryID)', [eventID, documentID], callback);
    }
};