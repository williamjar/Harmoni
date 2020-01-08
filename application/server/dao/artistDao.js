const Dao = require('./dao.js');

module.exports = class artistDao extends Dao {

    getAll(callback) {
        super.query('SELECT * FROM artist AND contact WHERE artist.contactID = contact.contactID', [], callback);
    }

    getOne(callback, artistID) {
        super.query('SELECT * FROM artist WHERE artistID = ? ', [artistID], callback);
    }

    createOne(callback) {
        super.query('INSERT INTO artist ', callback);
    }

    updateOne(json, callback){
        var val = [json.artistID, json.artistName];
        super.query('UPDATE artist set , where artistID = ?', callback);
    }

    deleteOne(callback, artistID) {
        super.query('DELETE FROM ', [artistID], callback);
    }

    addDocument(callback, artistID, documentID) {
        super.query('INSERT INTO event', [artistID, documentID], callback);
    }


}