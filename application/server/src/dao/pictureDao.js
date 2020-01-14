const Dao = require('./dao.js');

module.exports = class pictureDao extends Dao {
    updateOne(callback, pictureLink, pictureID) {
        super.query('UPDATE picture SET pictureLink = ? WHERE pictureID = ?', [pictureLink, pictureID], callback);
    }

    insertPicture(req, callback) {
        super.query('insert into picture (pictureLink) VALUES (?)', [req.path], callback);
    }

    deleteOne(callback, pictureID) {
        super.query('delete from picture where pictureID = ?', pictureID, callback);
    }

    getPicture(callback, pictureID) {
        super.query('select * from picture where pictureID = ?', pictureID, callback);
    }
};