const Dao = require('./dao.js');

module.exports = class contactDao extends Dao {

    getOne(callback, contactID) {
        super.query('SELECT * FROM contact WHERE contactID = ?', [contactID], callback);
    }

    createOne(callback, list) {
        super.query('INSERT INTO contact (contactName,phone,email) values(?, ?, ?)', list, callback);
    }

    updateOne(callback, list) {
        super.query('UPDATE contact SET contactName = ?,phone = ?,email = ? WHERE contactID = ?', list, callback);
    }

    deleteOne(callback, artistID) {
        super.query('DELETE FROM artist where artistID = ?', [artistID], callback);
    }
};
