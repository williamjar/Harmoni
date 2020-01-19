import runSQLFile from '../../../../runsqlfile';
import {CookieStore} from "../../store/cookieStore";
import {LoginService} from "../../store/loginService";
import {Connection} from "./connection";

let assert = require('assert');
const mocha = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../../../server/src/server');

const mysql = require("mysql");

chai.use(chaiHTTP);
chai.should();

const pool = Connection.privatePool;

mocha.describe('Cookie System', () => {
    mocha.before(done => {
        runSQLFile("../create.sql", pool, () => {
            runSQLFile("../testData.sql", pool, done);
        });
    });

    mocha.it('Should login a registered user, and then the token should be correct', () => {
        chai.request(app);
        LoginService.loginOrganizer('test@test.com', 'passord2', () => {
            assert.notEqual(CookieStore.currentUserID, -1);
            CookieStore.checkToken('test@test.com', status =>{
                assert.equal(status, true);
            });
        })
    });

    mocha.it('Should not login a non-registered user, and the token should not be registered', () => {
        LoginService.loginOrganizer('hallo@nei.no', 'Not registered', () => {
            assert.equal(CookieStore.currentToken, null);
            assert.equal(CookieStore.currentUserID, -1);
        });
    });

});