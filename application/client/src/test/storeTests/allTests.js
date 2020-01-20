import runSQLFile from '../../../../runsqlfile';
import {LoginService} from "../../store/loginService";
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import {Organizer} from "../../classes/organizer";
const Connection = require('./connection');

let assert = require('assert');
let mocha = require('mocha');

const pool = Connection.privatePool;

export function beforeAll(done) {
    runSQLFile('../create.sql', pool, () => {
        runSQLFile('../testData.sql', pool, () => {
            RegisterOrganizerService.registerOrganizer('tester1', 'test@test.com', 'passord1', () => {
                LoginService.loginOrganizer('test@test.com', 'passord1', () => {
                    done();
                });
            });
        });
    });
}

export let organizer = {
    email: "test@test.com",
    password: "passord1"
};