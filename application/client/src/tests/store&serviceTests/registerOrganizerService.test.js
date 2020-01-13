import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import runSQLFile from "../../../../runsqlfile";
import axios from "axios";

const mysql = require("mysql");

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

const privatePool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "joakimad",
    password: "LQliMP1A",
    database: "joakimad",
    debug: false,
    multipleStatements: true
});

beforeAll(done => {
    runSQLFile("../create.sql", privatePool, () => {
        runSQLFile("../testData.sql", privatePool, done);
    });
});

//TODO: MAKE THIS WORK
test('Can we add an organizer?', () => {
    RegisterOrganizerService.registerOrganizer("evengu", "even.gultvedt@gmail.com", "somepass", contactID => {
        expect(contactID).toBeBiggerThan(5);
    });
});