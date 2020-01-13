const Dao = require('./dao.js');

module.exports = class bugDao extends Dao {
    //Register bug
    registerBug(organizrID, json, callback){
        var val = [json.date, json.description, organizrID];
        super.query('INSERT INTO bug (date,description,organizerID) VALUES (?, ? , ?)',
            val,
            callback);
    }
};
