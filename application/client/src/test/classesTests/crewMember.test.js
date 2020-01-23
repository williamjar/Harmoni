import {CrewMember} from "../../classes/crewMember";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Crewmember', () => {
    mocha.describe('Constructor', () => {
        mocha.it('should create the description', () => {
            assert.equal(CrewMember.getTestCrewMember()[0].description, 'This lazy dude can only work every third sunday when theres a full moon');
        });
    });
    mocha.describe('Categories', () => {
        mocha.it('should have lazy work for the first element', () => {
            assert.equal(CrewMember.getTestCrewMember()[0].crewCategoryName, 'Lazy work');
        });
    });
});

