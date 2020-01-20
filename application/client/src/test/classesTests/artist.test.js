import {Artist} from "../../classes/artist";
let assert = require('assert');
const mocha = require('mocha');

mocha.describe('Artist', () => {
    mocha.describe('Constructor', () => {
        mocha.it('should create an artist with a genre that has a genrename', () => {
            assert.equal(Artist.getTestArtists()[0].genre.genreName, 'Folk');
        })
    });
    mocha.describe('Documents', () => {
        mocha.it('should be defined for this test artist', () => {
            assert.notEqual(Artist.getTestArtists()[0].documents[0], null);
        });
        mocha.it('should not be defined for this test artist', () => {
            assert.deepEqual(Artist.getTestArtists()[1].documents, []);
        })
    })
});

