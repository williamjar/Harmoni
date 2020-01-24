import runSQLFile from '../../../../runsqlfile';
import {LoginService} from "../../store/loginService";
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import {ArtistService} from "../../store/artistService";
const Connection = require('./connection');

const pool = Connection.privatePool;

let assert = require('assert');
const mocha = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../../../../server/src/server');

chai.use(chaiHTTP);
chai.should();

chai.request(server);

mocha.describe('Artist Service', function() {
    this.timeout(10000);
    mocha.beforeEach(done => {
        runSQLFile('../create.sql', pool, () => {
            runSQLFile('../testData.sql', pool, () => {
                RegisterOrganizerService.registerOrganizer('tester1', 'test@test.com', 'passord1', () => {
                    LoginService.loginOrganizer('test@test.com', 'passord1', () => {
                        done();
                    });
                });
            });
        });
    });

    mocha.describe('getArtist(artistID, callback)', () => {
        mocha.it('should return one artist if the ID exists', () => {
            ArtistService.getArtist(1, artist => {
                assert.notEqual(artist, null);
            });
        });
        mocha.it('Should return null if the ID does not exist', () => {
            ArtistService.getArtist(0, artist => {
                assert.equal(artist, null);
            });
        })
    });

    mocha.describe('createArtist(callback, name, phone, email, genreID, organizerID', () =>  {
        mocha.it('should create an artist given valid input', () => {
            ArtistService.createArtist(artist => {
                assert.notEqual(artist, null);
            }, "Even", "00000000", "e@e.c", 1, 1);
        });
        mocha.it('should not create an artist if the genre doesn\'t exist', () => {
            ArtistService.createArtist(artist => {
                assert.equal(artist, null);
            }, "Even", "00000000", "e@e.c", -1, 1);
        });
    });
});