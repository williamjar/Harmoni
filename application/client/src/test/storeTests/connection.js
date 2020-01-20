const mysql = require("mysql");

module.exports.privatePool = mysql.createPool({
        connectionLimit: 1,
        host: "mysql-ait.stud.idi.ntnu.no",
        user: "joakimad",
        password: "LQliMP1A",
        database: "joakimad",
        debug: false,
        multipleStatements: true
    });

module.exports.pool = mysql.createPool({
        connectionLimit: 1,
        host: "mysql",
        user: "root",
        password: "secret",
        database: "supertestdb",
        debug: false,
        multipleStatements: true
    });