const Dao = require('./dao.js');

module.exports = class bugDao extends Dao {


    //Register bug
    registerBug(callback, list){
        super.query('INSERT INTO bug (date , description , organizerID, resolved) VALUES (CURRENT_DATE, ?, ?, 0)', list , callback);
    }


    getAllBugsFromOrganizer(callback, organizerID){
        super.query('SELECT * FROM bug WHERE organizerID = ?', [organizerID], callback);
    }


    getOneBug(callback, bugID){
        super.query('SELECT * FROM bug WHERE bugID = ?', [bugID], callback);
    }

    getAllBugs(callback) {
        super.query('SELECT * FROM bug', callback);
    }

    deleteBug(callback, bugID) {
        super.query('DELETE FROM bug WHERE bugID = ?', [bugID], callback);
    }


};
