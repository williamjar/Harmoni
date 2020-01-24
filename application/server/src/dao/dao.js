/**
 * @class Dao
 * @classdesc The main Database Access Object
 * @type {Dao}
 */
module.exports = class Dao {
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Main method for querying the sql database.
     * @param {String}sql
     * The SQL string that gets queried.
     * @param {Array}params
     * Array of parameters for the query.
     * @param {function} callback
     * This function should contain what will happen with the results of the query.
     * This method (query) feeds inn a status and the SQL result as parameters.
     */
    query(sql, params, callback) {
        console.log("DAO PARAMS " + params);
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
                        console.log("dao: returning rows: ");
                        callback(200, rows);
                    }
                });
            }
        });
    }
};