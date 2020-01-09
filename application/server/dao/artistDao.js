const Dao = require('./dao.js');

module.exports = class artistDao extends Dao {

    //TODO: Write SQL statements

    getAll(callback) {
        super.query('SELECT * FROM artist, contact WHERE artist.contactID = contact.contactID', [], callback);
    }

    getOne(callback, artistID) {
        super.query('SELECT * FROM artist WHERE artistID = ? ', [artistID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO artist (genreID, organizerID, contactID) values(?, ?, ?)', list, callback);
    }

    updateOne(callback, genreID, artistID){
        super.query('UPDATE artist set genreID = ? WHERE artistID = ?', [genreID, artistID], callback);
    }

    deleteOne(callback, artistID) {
        super.query('DELETE FROM artist where artistID = ?', [artistID], callback);
    }

    addDocument(callback, documentLink, artistID, documentCategoryID) {
        super.query('INSERT INTO document (documentLink, artistID, documentCategoryID) ', [documentLink, artistID, documentCategoryID], callback);
    }

};