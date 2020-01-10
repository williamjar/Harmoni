const Dao = require('./dao.js');

module.exports = class documentDao extends Dao {

    createOne(callback, list) {
        super.query('INSERT INTO document (documentID, eventID, documentName, documentLink, artistID, crewID, documentCategoryID) values(DEFAULT, ?, ?, ?, ?, ?, ?)', list, callback);
    }

    updateOne(callback, list, documentID) {
        list.push(documentID);
        super.query('UPDATE document SET eventID = ?, documentName = ?, documentLink = ?, artistID = ?, crewID = ?, documentCategoryID = ? WHERE documentID = ?', list, callback);
    }

    deleteOne(callback, documentID) {
        super.query('DELETE FROM document WHERE documentID = ? ', [documentID], callback);
    }
};