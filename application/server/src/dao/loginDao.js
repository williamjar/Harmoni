const Dao = require('./dao');

module.exports = class LoginDao extends Dao{
    checkLogin(username, hashedPassword, callback){
        super.query("select username, password from organizer where username = ? and password = ?", [username, hashedPassword], callback);
    }
};