import {Organizer} from "../../classes/organizer";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Organizer', () => {
    mocha.describe('Events', () => {
        mocha.it('should not have a length', () => {
            assert.equal(Organizer.getTestOrganizer()[0].events.length, 0);
        });
    });
    mocha.describe('Contacts', () => {
        mocha.it('should have a length', () => {
            assert.equal(Organizer.getTestOrganizer()[0].contacts.length, 3);
        });
    });
    mocha.describe('Crew categories', () => {
        mocha.it('should have a length', () => {
            assert.equal(Organizer.getTestOrganizer()[0].contacts.length, 3);
        });
    });
});