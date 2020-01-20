import {RiderElement} from "../../classes/riderElement";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Rider Element constructor', () => {
   mocha.it('should create a status', () => {
      assert.equal(RiderElement.getTestRiderElement()[0].status, '7.5 hours of drying the cheese before serving');
      assert.equal(RiderElement.getTestRiderElement()[1].status, null);
   });
   mocha.it('should create a done checkbox', () => {
      assert.equal(RiderElement.getTestRiderElement()[0].isDone, false);
      assert.equal(RiderElement.getTestRiderElement()[1].isDone, true);
   });
});
