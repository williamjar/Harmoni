const Dao = require('./dao');

/**
 * @class LoginDao
 * @classdesc A Database Access Object for login services
 * @type {LoginDao}
 * @see Dao
 */
module.exports = class LoginDao extends Dao{

    /**
     * Check if the password and email for a user exists (used for log in)
     * @param {String}email
     * The email of the user.
     * @param {String}hashedPassword
     * The password of the user.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    checkLogin(email, hashedPassword, callback){
        super.query("select password, email from organizer join contact c on organizer.contactID = c.contactID where email = ? and password = ?;", [email, hashedPassword], callback);
    }

    /**
     * Check if a user exists
     * @param {String}username
     * The username of the potential user.
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    checkUserExists(username, callback){
        super.query("select username from organizer where username = ?", [username], callback);
    }
};