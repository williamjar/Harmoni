const Dao = require('./dao.js');

module.exports = class eventDao extends Dao {

    getAll(callback) {
        super.query('SELECT ', [], callback);
    }

    getOne(callback, eventID) {
        super.query('SELECT ', [eventID], callback);
    }

    getbyStatus(callback, eventID) {
        super.query('SELECT ', [eventID], callback);
    }

    deleteOne(callback, eventID) {
        super.query('DELETE FROM ', [eventID], callback);
    }
}