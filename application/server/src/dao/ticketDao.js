const Dao = require('./dao.js');

module.exports = class ticketDao extends Dao {

    getOneTicket(callback, ticketTypeID){
        super.query('SELECT * FROM ticketType WHERE ticketTypeID = ?', [ticketTypeID], callback);
    }


    getAllTicketsForEvent(callback, eventID){
        super.query('SELECT * FROM ticketType WHERE eventID = ?', [eventID], callback);
    }

    addTicket(callback, list) {
        super.query('INSERT INTO ticketType (ticketTypeID , eventID, ticketTypeName, price, amount, releaseDate, releaseTime, hasEndDate, endDate, endTime, description) VALUES (default, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', list, callback);
    }

    updateTicket(callback, list) {
        super.query('UPDATE ticketType SET ticketTypeName = ?, price = ?, amount = ?, releaseDate = ?, releaseTime = ?, endDate = ?, endTime = ?, description = ? WHERE ticketTypeID = ?' , list, callback);
    }

    deleteTicket(callback, eventID, ticketTypeID) {
        super.query('DELETE FROM ticketType WHERE eventID = ? AND ticketTypeID = ?', [eventID, ticketTypeID], callback);
    }

};