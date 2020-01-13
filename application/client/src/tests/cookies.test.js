import {LoginService} from "../store/loginService";
import runSQLFile from '../../../runsqlfile';
import {CookieStore} from "../store/cookieStore";

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
    LoginService.loginOrganizer('geir@lillelondon.no', 'salted/hashed passord', () => {
        console.log(CookieStore.currentUserID);
        expect(CookieStore.currentUserID).not.toBe(null);

        CookieService.checkToken(CookieStore.currentToken);
        console.log(CookieStore.currentToken);
        expect(CookieStore.currentToken).not.toBe(null);
    });
});

test('Check that user is not registered with a valid token', () => {
    LoginService.loginOrganizer('Unregistered', 'Unregistered', () => {
        expect(CookieStore.currentUserID).toBe(null);
        expect(CookieStore.currentToken).toBe(null);
    });
});