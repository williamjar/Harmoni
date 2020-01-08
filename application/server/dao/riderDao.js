const Dao = require('./dao.js');

module.exports = class riderDao extends Dao {

    createOne(callback) {
        super.query('INSERT INTO riderElement ', callback);
    }

};