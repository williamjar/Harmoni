import runSQLFile from '../../../../runsqlfile';
import {LoginService} from "../../store/loginService";
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
const Connection = require('./connection');

let assert = require('assert');
const mocha = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../../../server/src/server');

const mysql = require("mysql");

chai.use(chaiHTTP);
chai.should();

chai.request(app);

const pool = Connection.privatePool;

mocha.describe('User system', function() {
    this.timeout(10000);
    mocha.before(done => {
        runSQLFile("../create.sql", pool, () => {
            runSQLFile('../testData.sql', pool, () => {
                RegisterOrganizerService.registerOrganizer('tester1', 'test@test.com', 'passord1', (statusCode, err) => {
                    done();
                });
            });
        });
    });

    mocha.describe('Login system', () => {
        mocha.it('Should login an existing organizer', () => {
            LoginService.loginOrganizer('test@test.com', 'passord1', status => {
                assert.equal(status, 200);
            });
        });
        mocha.it('should not login a non-existing user', () => {
            LoginService.loginOrganizer('test@test.no', 'non-existing-pass', status => {
                assert.notEqual(status, 200);
            });
        });
    });
});
