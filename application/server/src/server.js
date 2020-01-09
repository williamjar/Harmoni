const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.idi.ntnu.no",
    user: "joakimad",
    password: "LQliMP1A",
    database: "joakimad",
    debug: false
});

const contactDaoObj = require('../dao/contactDao.js');
let contactDao = new contactDaoObj(pool);

app.get("/API/contact/:contactID", (req, res) => {
    console.log("Request for contact");
    contactDao.getOne((status, data) => {
        res.status(status);
        res.json(data);
    }, req.params.contactID);
});

const server = app.listen(8080);

