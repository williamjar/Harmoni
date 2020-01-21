import {TicketType} from "../../classes/ticketType";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Ticket type constructor', () => {
   mocha.it('should have an end date checkbox and values', () => {
      assert.equal(TicketType.getTestTicketTypes()[0].hasEndDate, true);
      assert.notEqual(TicketType.getTestTicketTypes()[0], null);
      assert.notEqual(TicketType.getTestTicketTypes()[0], null);
   });
});