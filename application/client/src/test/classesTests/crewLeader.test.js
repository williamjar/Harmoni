import {CrewLeader} from "../../classes/crewLeader";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Crewleader constructor for the category', () => {
   mocha.it('should be defined', () => {
       assert.equal(CrewLeader.getTestCrewLeader()[0].crewCategory, "Lazy work");
   });
});