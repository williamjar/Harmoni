import {LoginService} from "../../store/loginService";
import {beforeAll} from "./allTests";

let assert = require('assert');
const mocha = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../../../../server/src/server');

chai.use(chaiHTTP);
chai.should();

chai.request(server);

mocha.describe('User system', function() {
    this.timeout(10000);
    mocha.before(done => {
        beforeAll(done);
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
