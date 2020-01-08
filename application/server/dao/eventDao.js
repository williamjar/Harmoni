const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

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




}