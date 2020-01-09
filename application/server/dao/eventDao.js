const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

    //TODO: Write SQL statements

    getAll(callback) {
        super.query('SELECT ', [], callback);
    }

    getOne(callback, eventID) {
        super.query('SELECT ', [eventID], callback);
    }

    getByStatus(callback, eventID) {
        super.query('SELECT ', [eventID], callback);
    }

    deleteOne(callback, eventID) {
        super.query('DELETE FROM ', [eventID], callback);
    }

    publishOne(callback, eventID) {
        super.query('UPDATE  ', [eventID], callback);
    }

    ArchiveOne(callback, eventID) {
        super.query('UPDATE ', [eventID], callback);
    }

    getAllPublished(callback) {
        super.query('SELECT ', [], callback);
    }

    getAllPlanned(callback) {
        super.query('DELETE FROM ', [], callback);
    }

    getAllArchived(callback){
        super.query('SELECT', [], callback);
    }

    getNumberArchived(callback) {
        super.query('SELECT COUNT(*) FROM', [], callback);
    }

    getXArchived(callback, x){
        super.query('SELECT ', [x], callback);
    }

    addArtist(callback, eventID, artistID) {
        super.query('INSERT INTO event', [eventID], [artistID], callback);
    }

    getAllArtists(callback, eventID) {
        super.query('SELECT * FROM event_artist, artist, contact WHERE eventID = ? AND event_artist = artist.artistID AND artist.contactID = contact.contactID', [eventID], callback);
    }

    addDocument(callback, eventID, documentID) {
        super.query('INSERT INTO document VALUES (DEFAULT, ?, ?, ?, ?, NULL, ?, documentCategoryID)', [eventID, documentID], callback);
    }
};