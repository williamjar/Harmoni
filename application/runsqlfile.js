let fs = require('fs');

module.exports = function(filename, pool, done){
    console.log(__dirname);
    console.log("runsqlfile: reading file " + filename);
    let sql = fs.readFileSync(filename, "utf-8");
    pool.getConnection((err, connection) => {
        if (err){
            console.log("runsqlfile: error connecting");
            done();
        }
        else{
            console.log("runsqlfile: connected");
            connection.query(sql, (err, rows) => {
                connection.release();
                if (err){
                    console.log(err);
                    done();
                }
                else{
                    console.log("runsqlfile: run OK");
                    done();
                }
            });
        }
    });
};