const Dao = require('./dao.js');

/**
 * @class ticketDao
 * @classdesc A Database Access Object for ticket.
 * @type {ticketDao}
 * @see Dao
 */
module.exports = class ticketDao extends Dao {

    /**
     * Get a ticket
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}ticketTypeID
     * The ID of the ticket
     */
    getOneTicket(callback, ticketTypeID){
        super.query('SELECT * FROM ticketType WHERE ticketTypeID = ?', [ticketTypeID], callback);
    }

    /**
     * Get all tickets for an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event.
     */
    getAllTicketsForEvent(callback, eventID){
        super.query('SELECT * FROM ticketType WHERE eventID = ?', [eventID], callback);
    }

    /**
     * Get all tickets
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     */
    getAllTickets(callback) {
        super.query('SELECT * FROM ticketType', callback);
    }

    /**
     *Add a ticket type to an event
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [ticketTypeID, eventID, ticketTypeName, price, amount, releaseDate, releaseTime, hasEndDate, endDate, endTime, description]
     */
    addTicket(callback, list) {
        super.query('INSERT INTO ticketType (ticketTypeID , eventID, ticketTypeName, price, amount, releaseDate, releaseTime, hasEndDate, endDate, endTime, description) VALUES (default, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', list, callback);
    }

    /**
     * Update a ticket
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {Array}list
     * List of parameters [ticketTypeName, price, amount, releaseDate, releaseTime, endDate, endTime, description, ticketTypeID]
     */
     updateTicket(callback, list) {
        super.query('UPDATE ticketType SET ticketTypeName = ?, price = ?, amount = ?, releaseDate = ?, releaseTime = ?, endDate = ?, endTime = ?, description = ? WHERE ticketTypeID = ?' ,list, callback);
    }

    /**
     * Delete a ticket
     * @param {function} callback
     * Gets passed on to the main DAO
     * @see Dao
     * @param {int}eventID
     * The ID of the event that has the ticket.
     * @param {int}ticketTypeID
     * The ID of the ticket.
     */
    deleteTicket(callback, eventID, ticketTypeID) {
        super.query('DELETE FROM ticketType WHERE eventID = ? AND ticketTypeID = ?', [eventID, ticketTypeID], callback);
    }

};

