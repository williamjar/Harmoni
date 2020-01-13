const Dao = require('./dao');

module.exports = class OrganizerIDDao extends Dao{
    getOrganizerFromEmail(email, callback){
        super.query("select organizer.organizerID from organizer join contact c on organizer.contactID = c.contactID where c.email = ?", [email], callback);
    }
};