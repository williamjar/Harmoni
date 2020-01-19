const mysql = require("mysql");

export class Connection{
    static privatePool = mysql.createPool({
        connectionLimit: 1,
        host: "mysql-ait.stud.idi.ntnu.no",
        user: "evengu",
        password: "O7KhlwWQ",
        database: "evengu",
        debug: false,
        multipleStatements: true
    });

    static pool = mysql.createPool({
        connectionLimit: 1,
        host: "mysql",
        user: "root",
        password: "secret",
        database: "supertestdb",
        debug: false,
        multipleStatements: true
    });
}