const Dao = require('./dao.js');

module.exports = class artistDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM artist, contact WHERE artist.contactID = contact.contactID',  callback);
    }

    getOne(callback, artistID) {
        super.query('SELECT contactName,phone,email,genreName,organizer.organizerID FROM artist JOIN organizer ON artist.organizerID = organizer.organizerID JOIN contact ON artist.contactID = contact.contactID JOIN genre ON artist.genreID = genre.genreID WHERE artistID = ?', [artistID], callback);
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

    addDocument(callback, artistID, documentID) {
        super.query('UPDATE document SET artistID = ? WHERE documentID = ?', [artistID, documentID], callback);
    }

};