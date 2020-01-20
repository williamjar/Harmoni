import {CrewMember} from "../../classes/crewMember";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Crewmember', () => {
    mocha.describe('Constructor', () => {
        mocha.it('should create the description', () => {
            assert.equal(CrewMember.getTestCrewMember()[0].description, 'This lazy dude can only work every third sunday when theres a full moon');
        });
    })
    mocha.describe('Categories', () => {
        mocha.it('Should have a length of several elements', () => {
            let crewMember = CrewMember.getTestCrewMember()[0];
            crewMember.addCrewCategory("Not lazy");
            assert.equal(crewMember.crewCategories.length, 2);
        });
        mocha.it('should have lazy work for the first element', () => {
            assert.equal(CrewMember.getTestCrewMember()[0].crewCategories[0], 'Lazy work');
        });
    });
});

