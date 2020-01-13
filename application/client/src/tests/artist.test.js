import runSQLFile from '../../../runsqlfile';
import {ArtistService} from "../service&store/artistService.js";
import {Artist} from "../classes/artist.js";

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
    runSQLFile("../create.sql", privatePool, () => {
        runSQLFile("../testData.sql", privatePool, done);
    });
});

test('Check that right artist can be pulled from database', () => {
    let expected = new Artist("Anne","+92929292","anne@music.no",1,1,1);
    let actual = ArtistService.getArtist(1);
    expect(actual).toBe(expected);
});

test('Check that a artist can be added', () => {
    ArtistService.createArtist("DJ Disk Jockey","+4891325221","DJDJ@gmail.com",1,1);
    let expected = new Artist("DJ Disk Jockey","+4891325221","DJDJ@gmail.com");
    expect(expected).toBe(ArtistService.getArtist(3));
});

