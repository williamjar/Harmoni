import {RiderElement} from "../../classes/riderElement";

test('Rider Element Constructor', () => {
   expect(RiderElement.getTestRiderElement()[0].status).toBe('Almost done, 4 more hours of drying...');
   expect(RiderElement.getTestRiderElement()[0].isDone).toBe(false);
   expect(RiderElement.getTestRiderElement()[1].isDone).toBe(true);
   expect(RiderElement.getTestRiderElement()[1].status).toBe(null);
});