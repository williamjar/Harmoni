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

app.put("/API/contact/:contactID", (request, response) => {
    console.log("request to update contact");
    let val = [
        request.body.contactName,
        request.body.phone,
        request.body.email,
        request.params.contactID
    ];

    contactDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/API/contact/:contactID", (request, response) => {
    console.log("request to delete contact");
    contactDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID)
});

// ARTIST
app.get("/API/artist/:artistID", (request, response) => {
    console.log("request for artist");
    artistDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.artistID);
});

app.post("/API/artist", (request, response) => {
    console.log("request to add artist");
    let val = [
        request.body.genreID,
        request.body.organizerID,
        request.body.contactID
    ];
    artistDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.put("/API/artist/:artistID", (request, response) => {
    console.log("request to update artist");
    let val = [
        request.body.genreID,
        request.body.organizerID,
        request.body.contactID,
        request.params.artistID
    ];

    artistDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/API/artist/:artistID", (request, response) => {
    console.log("request to delete artist");
    artistDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.artistID)
});

// CREW
app.get("/API/specificcrew/:crewID", (request, response) => {
    console.log("request for crew");
    crewDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID);
});

app.get("/API/crew/:organizerID", (request, response) => {
    console.log("request for all crew belonging to one organizer");
    crewDao.getAllForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/API/event/crew/:eventID", (request, response) => {
    console.log("request for all crew attached to en event");
    crewDao.getAllForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.get("/API/crew/categories/organizerID", (request, response) => {
    console.log("request for all crew attached to en event");
    crewDao.getAllCategories((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.post("/API/crew", (request, response) => {
    console.log("request to add crew");
    let val = [
        request.body.crewID,
        request.body.description,
        request.body.contactID
    ];
    crewDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.put("/API/crew/:crewID", (request, response) => {
    console.log("request to update crew");

    let val = [
        request.body.description,
        request.params.crewID
    ];

    crewDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/API/crew/:crewID", (request, response) => {
    console.log("request to delete crew");
    crewDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID)
});

// EVENT

//Get all events
app.get("/events", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getAll((status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Get one event
app.get("/events/:eventID", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//TODO: Check if this endpoint works with localStorage
//Get all events by status
app.get("/API/events/status/:status", (request, response) => {
    console.log("Express: Request to get all events for organizer " + localStorage.get("organizerID") + " with status " + request.params.status);
    eventDao.getByStatusForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, localStorage.get("organizerID"));
});

//Delete an event
app.delete("/API/events/:eventID", (request, response) => {
    console.log("Express: Request to delete event " + request.params.eventID);
    eventDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Publish an event
app.put("/API/events/:eventID", (request, response) => {
    console.log("Express: request to publish event " + request.params.eventID);
    eventDao.publishOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Archive an event
app.put("/API/events/:eventID", (request, response) => {
    console.log("Express: request to archive event " + request.params.eventID);
    eventDao.archiveOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Get number of events with status
app.get("/API/events/status/:status/amount", (request, response) => {
   console.log("Express: request to get number of elements with status " + request.params.status + " for organizer " + localStorage.get("organizerID"));
   eventDao.getNumberOfStatusForOrganizer((status, data) => {
       response.status(status);
       response.json(data);
   }, request.params.status, localStorage.get("organizerID"));
});

//TODO: Check if this is necessary
//Get X events with status after date
app.get("/API/events/status/:status/:amount/:date", (request, response) => {
    console.log("Express: request to get " + request.params.amount + " elements with status " + request.params.status + " after date " + request.params.date + " for organizer " + localStorage.get("organizerID"));
    eventDao.getXOfStatusAfterDateForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, request.params.amount, request.params.date, localStorage.get("organizerID"));
});

//Get all artists for event
app.get("/API/events/:eventID/artists", (request, response) => {
    console.log("Express: request to get all artists for event " + request.params.eventID);
    eventDao.getAllArtists((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Add a document to event
app.put("/API/events/:eventID/documents/:documentID", (request, response) => {
    console.log("Express: request to add a document " + request.params.documentID + "to event " + request.params.eventID);
    eventDao.addDocument((status, data) => {
       response.status(status);
       response.json(data);
    }, request.params.eventID, request.params.documentID);
});

const server = app.listen(8080);