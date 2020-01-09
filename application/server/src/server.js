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

const artistDaoObj = require('../dao/artistDao.js');
const contactDaoObj = require('../dao/contactDao.js');
const crewDaoObj = require('../dao/crewDao.js');
const documentDaoObj = require('../dao/documentDao.js');
const eventDaoObj = require('../dao/eventDao.js');
const organizerDaoObj = require('../dao/organizerDao.js');
const riderDaoObj = require('../dao/riderDao.js');

let artistDao = new artistDaoObj(pool);
let contactDao = new contactDaoObj(pool);
let crewDao = new crewDaoObj(pool);
let documentDao = new documentDaoObj(pool);
let eventDao = new eventDaoObj(pool);
let organizerDao = new organizerDaoObj(pool);
let riderDao = new riderDaoObj(pool);

// CONTACT

app.get("/API/contact/:contactID", (request, response) => {
    console.log("request to get a contact");
    contactDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID);
});

app.post("/API/contact", (request, response) => {
    console.log("request to add contact");
    let val = [
        request.body.contactName,
        request.body.phone,
        request.body.email
    ];

    contactDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.put("/API/contact", (request, response) => {
    console.log("request to add contact");
    let val = [
        request.body.contactName,
        request.body.phone,
        request.body.email
    ];

    contactDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

// ARTIST

app.get("/API/artist/:artistID", (request, response) => {
    console.log("request for artist");
    artistDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.artistID);
});

//Get all events
app.get("/events", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getAll((status, data) =>{
       response.status(status);
       response.json(data);
    });
});

//Get one event
app.get("/events/:eventID", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getOne((status, data) =>{
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

const server = app.listen(8080);

