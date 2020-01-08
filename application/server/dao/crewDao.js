const Dao = require('./dao.js');

module.exports = class crewDao extends Dao {

    createOne(callback) {
        super.query('INSERT INTO riderElement ', callback);
    }

    updateOne(callback, riderElementID, artistID, eventID) {
        super.query('UPDATE ', [riderElementID, artistID, eventID], callback);
    }

    getAllForOrganizer(callback, organizerID){
        super.query('SELECT *', [organizerID], callback);
    }

    getAllForEvent(callback, eventID){
        super.query('SELECT *', [eventID], callback);
    }

    addDocument(callback, crewID, documentID) {
        super.query('INSERT INTO', [crewID, documentID], callback);
    }

    setResponsible(callback, crewID, responsible){
        super.query('UPDATE', [crewID, responsible], callback);
    }
};