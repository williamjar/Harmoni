import {Event} from "../../classes/event";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Event', () => {
   mocha.describe('Crew categories', () => {
      mocha.it('Should have a length', () => {
         assert.equal(Event.getTestEvents()[0].crewCategories.length, 2);
      });
   });
   mocha.describe('Artists', () => {
      mocha.it('Should have a length', () => {
         assert.equal(Event.getTestEvents()[0].artists.length, 2);
      });
   });
   mocha.describe('Rider elements', () => {
      mocha.it('Should have a length', () => {
         assert.equal(Event.getTestEvents()[0].riderElements.length, 2);
      });
      mocha.it('Should be defined per artist', () => {
         assert.equal(Event.getTestEvents()[0].getRiderFromArtist(Event.getTestEvents()[0].artists[0]).length, 2);
         assert.equal(Event.getTestEvents()[0].getRiderFromArtist(Event.getTestEvents()[0].artists[1]).length, 2);
      });
   });
});
