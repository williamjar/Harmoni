const Dao = require('./dao');

module.exports = class LoginDao extends Dao{

    checkLogin(email, hashedPassword, callback){
        super.query("select password, email from organizer join contact c on organizer.contactID = c.contactID where email = ? and password = ?;", [email, hashedPassword], callback);
    }

    checkUserExists(username, callback){
        super.query("select username from organizer where username = ?", [username], callback);
    }
};