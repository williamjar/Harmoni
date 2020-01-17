import {TicketType} from "../../classes/ticketType";

test('Ticket type constructor checking end date', () => {
   expect(TicketType.getTestTicketTypes()[0].hasEndDate).toBe(true);
   expect(TicketType.getTestTicketTypes()[0].endDate).not.toBe(null);
   expect(TicketType.getTestTicketTypes()[0].endTime).not.toBe(null);
});