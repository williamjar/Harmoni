import {Contact} from "../../classes/contact";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Contact', () => {
    mocha.describe('Constructor', () => {
        mocha.it('should create name', () => {
            assert.equal(Contact.getTestContacts()[0].contactName, "organizer One");
        });
        mocha.it('should create phone number', () => {
            assert.equal(Contact.getTestContacts()[0].phone, "00 00 12 34");
        });
        mocha.it('should create an email address', () => {
            assert.equal(Contact.getTestContacts()[0].email, "mail@organisasjon.no");
        });
    });
    mocha.describe('One of the Contacts', () => {
        mocha.it('Should not have an email', () => {
            assert.equal(Contact.getTestContacts()[2].email, null);
        });
    });
});
