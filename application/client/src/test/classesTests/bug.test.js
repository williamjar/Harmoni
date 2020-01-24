import {Bug} from "../../classes/bug";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Bug', () => {
   mocha.describe('Constructor', () => {
       mocha.it('should have an id', () => {
           assert.equal(Bug.getTestBugs()[0].bugID, 0);
       });
       mocha.it('should have a date', () => {
           assert.equal(Bug.getTestBugs()[0].date, "20200108");
       });
       mocha.it('should have a description', () => {
           assert.equal(Bug.getTestBugs()[0].description, "Stuff gone \'rong");
       })
   })
});