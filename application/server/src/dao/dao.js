module.exports = class Dao {
    constructor(pool) {
        this.pool = pool;
    }
    query(sql, params, callback) {
        this.pool.getConnection((err, connection) => {
            console.log("dao: connected to database");
            if (err) {
                console.log("dao: connection error");
                callback(500, { error: "connection error" });
            } else {
                console.log("dao: running sql: " + sql);
                connection.query(sql, params, (err, rows) => {
                    connection.release();
                    if (err) {
                        console.log(err);
                        callback(500, { error: "querying error" });
                    } else {
                        console.log("dao: returning rows: " + rows);
                        callback(200, rows);
                    }
                });
            }
        });
    }
};