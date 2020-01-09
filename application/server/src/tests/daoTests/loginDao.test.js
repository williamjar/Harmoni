const LoginDao = require('../../dao/loginDao');
const mysql = require("mysql");

function printCallback(status, data){
    console.log("Test callback: status=" + status + ", data=" + JSON.stringify(data));
}

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

let loginDao = new LoginDao(pool);

afterAll(() => {
    pool.end();
});

test('Login should work', done => {
    console.log("test");
    function callback(status, data){
        printCallback(status, data);
        expect(status).toBe(200);
        done();
    }
    loginDao.checkLogin('LilleLondon', 'salted/hashed passord', callback);
});

test('Login should not work', done => {
    function callback(status, data){
        printCallback(status, data);
        expect(status).toBe(200);
        expect(data.length).toBe(0);
        done();
    }
    loginDao.checkLogin('Unregistered', 'Unregistered', callback);
});
