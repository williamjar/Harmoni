const Dao = require('./dao');

module.exports = class OrganizerIDDao extends Dao{
    getOrganizerIDFromUsername(username, callback){
        super.query("select organizerID from organizer where username=?", [username], callback);
    }
};