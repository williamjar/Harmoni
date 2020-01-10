import {LoginService} from "../cookies_client/loginAxios";
import {CookieService} from "../cookies_client/cookies";
import runSQLFile from '../../../runsqlfile';

let mysql = require("mysql");

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let privatePool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql-ait.stud.idi.ntnu.no",
    user: "evengu",
    password: "O7KhlwWQ",
    database: "evengu",
    debug: false,
    multipleStatements: true
});

beforeAll(done => {
    console.log("Hello world!");
    runSQLFile("../create.sql", pool, () => {
        runSQLFile("../testData.sql", pool, done);
    });
});

test('Check that a user is registered with a valid token', () => {
    LoginService.loginOrganizer('LilleLondon', 'salted/hashed passord').then(() => {
        console.log(localStorage.getItem('organizerID'));
        expect(localStorage.getItem('organizerID')).not.toBe(null);

        CookieService.checkToken(localStorage.getItem('access-token'));
        console.log(localStorage.getItem('access-token'));
        expect(localStorage.getItem('access-token')).not.toBe(null);
    });
});

test('Check that user is not registered with a valid token', () => {
    LoginService.loginOrganizer('Unregistered', 'Unregistered').then(() => {
        expect(localStorage.getItem('organizerID')).toBe(null);
        expect(localStorage.getItem('access-token')).toBe(null);
    })
});