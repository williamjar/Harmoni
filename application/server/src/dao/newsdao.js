const Dao = require("./dao.js");

//Sql queries for associated with news
module.exports = class NewsDao extends Dao {
    getAll(callback) {
        super.query("select news_id, title, content, ingress, time, pictureURL, importance, category_id, writer, caption rating from news order by time desc", [], callback);
    }
};
