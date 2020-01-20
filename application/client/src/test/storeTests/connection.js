const mysql = require("mysql");

module.exports.privatePool = mysql.createPool({
        connectionLimit: 1,
        host: "mysql-ait.stud.idi.ntnu.no",
        user: "evengu",
        password: "O7KhlwWQ",
        database: "evengu",
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