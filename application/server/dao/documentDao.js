const Dao = require('./dao.js');

module.exports = class documentDao extends Dao {

    createOne(callback) {
        super.query('INSERT INTO document ', [], callback);
    }

    updateOne(callback, documentID) {
        super.query('UPDATE artist ', [documentID], callback);
    }

    deleteOne(callback, documentID) {
        super.query('DELETE FROM ', [documentID], callback);
    }
};