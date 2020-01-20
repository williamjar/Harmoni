const Dao = require('./dao.js');

module.exports = class artistDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM artist, contact WHERE artist.contactID = contact.contactID',  callback);
    }

    getAllForOrganizer(callback, organizerID) {
        super.query('SELECT * FROM artist, contact WHERE organizerID = ? AND artist.contactID = contact.contactID', [organizerID], callback);
    }

    getAllForEvent(callback, eventID) {
        super.query('SELECT * FROM artist, contact, event_artist WHERE artist.contactID = contact.contactID  AND artist.artistID = event_artist.artistID AND event_artist.eventID = ?', [eventID], callback);
    }

    getOne(callback, artistID) {
        super.query('SELECT * FROM artist JOIN organizer ON artist.organizerID = organizer.organizerID JOIN contact ON artist.contactID = contact.contactID JOIN genre ON artist.genreID = genre.genreID WHERE artistID = ?', [artistID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO artist (genreID, organizerID, contactID) values(?, ?, ?)', list, callback);
    }

    updateOne(callback, genreID, artistID){
        super.query('UPDATE artist SET genreID = ? WHERE artistID = ?', [genreID, artistID], callback);
    }

    deleteOne(callback, artistID) {
        super.query('DELETE FROM artist WHERE artistID = ?', [artistID], callback);
    }

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