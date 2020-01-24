const Dao = require('./dao.js');

/**
 * @class pictureDao
 * @classdesc A Database Access Object for pictures
 * @type {pictureDao}
 * @see Dao
 */
module.exports = class pictureDao extends Dao {

    /**
     * Update a picture with a new link
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {String}pictureLink
     * The new picture link.
     * @param {String}pictureID
     * The ID of the picture.
     */
    updateOne(callback, pictureLink, pictureID) {
        super.query('UPDATE picture SET pictureLink = ? WHERE pictureID = ?', [pictureLink, pictureID], callback);
    }

    /**
     * Create a new picture
     * @see pictureDao.insertPicture
     * @param {String}path
     * The link to the new image.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    insertPicture(path, callback) {
        super.query('insert into picture (pictureLink) VALUES (?)', [path], callback);
    }

    /**
     * Create a new picture
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {String}link
     * The link to the new image.
     */
    createOne(callback, link) {
        super.query('insert into picture (pictureLink) VALUES (?)', link, callback);
    }

    /**
     * Delete a picture
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}pictureID
     * The ID of the picture.
     */
    deleteOne(callback, pictureID) {
        super.query('delete from picture where pictureID = ?', pictureID, callback);
    }

    /**
     * Get a picture
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}pictureID
     * The ID of the picture
     */
    getPicture(callback, pictureID) {
        super.query('select * from picture where pictureID = ?', pictureID, callback);
    }
};