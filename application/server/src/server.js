const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const LoginDao = require('./dao/loginDao');
const SECRET = require('./cookieConfig');
const fs = require('fs');
const EventEmitter = require("events").EventEmitter;
const body = new EventEmitter();

app.use(bodyParser.json());
app.use(cors());

/*const pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "evengu",
    password: "O7KhlwWQ",
    database: "evengu",
    debug: false,
    multipleStatements: true
});*/

const pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "joakimad",
    password: "LQliMP1A",
    database: "joakimad",
    debug: false,
    multipleStatements: true
});

const OrganizerIDDao = require("./dao/organizerIDDao");
const artistDaoObj = require('./dao/artistDao.js');
const bugDaoObj = require('./dao/bugDao.js');
const contactDaoObj = require('./dao/contactDao.js');
const crewDaoObj = require('./dao/crewDao.js');
const documentDaoObj = require('./dao/documentDao.js');
const eventDaoObj = require('./dao/eventDao.js');
const organizerDaoObj = require('./dao/organizerDao.js');
const riderDaoObj = require('./dao/riderDao.js');
const documentationDaoObj = require("./dao/documentationdao.js");
let artistDao = new artistDaoObj(pool);
let bugDao = new bugDaoObj(pool);
let contactDao = new contactDaoObj(pool);
let crewDao = new crewDaoObj(pool);
let documentDao = new documentDaoObj(pool);
let documentationDao = new documentationDaoObj(pool);
let eventDao = new eventDaoObj(pool);
let organizerDao = new organizerDaoObj(pool);
let riderDao = new riderDaoObj(pool);


const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));


//----------------- DOCUMENTATION ---------------------
//Check if a folder exists for user
function checkIfFolderExist(name, path) {
    if(name != null){
        //Check folder existence
        if(fs.existsSync(path + name)){
            return true;
        } else {
            return false;
        }
    }
    return false;
}


function deleteFile(path) {
    try{
        fs.unlink(path, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    } catch (e) {
        console.log("test");
    }
}

const resource_path = path.join(__dirname, '/../../client/public/resources/');
var storage = multer.diskStorage({
    //Declaring destination for file
    destination: function(req, file, cb) {
        try{
            //If user folder exist but not document category folder, create and set destination path
            if(checkIfFolderExist(req.params.id, resource_path)){
               if(!checkIfFolderExist(req.params.folderName, resource_path + req.params.id + "/" + req.params.folderName)) {
                   try {
                       fs.mkdirSync(resource_path + req.params.id + "/" + req.params.folderName);
                   } catch (e) {
                       console.log("Error creating document category folder");
                   }
                   cb(null, resource_path + req.params.id + "/" + req.params.folderName);
               }
               //User and document category folder exist. Set destination
               else {
                   cb(null, resource_path + req.params.id + "/" + req.params.folderName);
               }
            }
            //If neither user folder or document category folder exist. Create both
            else {
                try {
                    fs.mkdirSync(resource_path + req.params.id);
                    try {
                        fs.mkdirSync(resource_path + req.params.id + "/" + req.params.folderName );
                        cb(null, resource_path + req.params.id + "/" + req.params.folderName);
                    } catch (e) {
                        console.log("Error creating document category folder");
                    }
                } catch (e) {
                    console.log("Error creating user folder");
                }
            }
        } catch (e) {
            console.log("An error occurred");
        }

    },
    //Adding file to destination
    filename: function (req, file, cb) {
        //Create file in server. If user upload same file append time for unique name
        try{
            if (fs.existsSync(resource_path + req.params.id + '/' + req.params.folderName + "/" + file.originalname)) {
                cb(null, Date.now() + "--" + file.originalname)
            } else {
                cb(null, file.originalname)
            }
        } catch (e) {
            console.log("An error occurred")
        }
    }
});


//Create one directory for user with id as name
/*
const resource_path = path.join(__dirname, '/../../client/public/resources/');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        try{
            if (fs.existsSync(resource_path + req.params.id)) {
                console.log('The folder exists.');
            } else {
                fs.mkdirSync( resource_path + req.params.id );
            }
        } catch (e) {
            console.log("An error occurred");
        }
        cb(null, resource_path + req.params.id );

    },
    filename: function (req, file, cb) {
        try{
            if (fs.existsSync(resource_path + req.params.id + '/' + file.originalname)) {
                 cb(null, Date.now() + "--" + file.originalname)
            } else {
                cb(null, file.originalname)
            }
        } catch (e) {
            console.log("An error occurred")
        }
    }
});*/


var upload = multer({ storage: storage });


//Post request for uploading multiple files
app.post('/upload/:id/:folderName', upload.array('file', 10), (req, res) => {
    try {
        res.send(req.files);
    }catch(err) {
        res.send(400);
    }
});

app.get("/api/:eventID/documents/category", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocumentCategories((status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.get("/api/:eventID/documents", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocuments(req.params.eventID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/:documentID", (req, res) => {
    documentationDao.getOneDocument(req.params.eventID, req.params.documentID,(status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.delete("/api/:eventID/documents/:documentCategory/:fileName", (req, res) => {
    documentationDao.deleteDocument(req.params.eventID, req.params.documentID,(status, data) => {
        res.status(status);
        res.json(data);
        //Server stops if file dont exists
        deleteFile(resource_path + req.params.eventID + "/" + req.params.documentCategory + "/" + req.params.fileName)
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.changeDocumentCategory(req.params.eventID, req.params.documentCategoryID, req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create", (req, res) => {
    documentationDao.insertDocument(req.params.eventID, req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/artist", (req, res) => {
    documentationDao.insertDocumentArtist(req.params.eventID, req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/crew", (req, res) => {
    documentationDao.insertDocumentCrew(req.params.eventID, req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

let publicKey = "tYQPoIe6PTRmFa1mTeuhE_JMi2_iU6hkZcWqM4YYlV9PQz7g-4PhwLen0u2nC4-n4Khegt6l198zm5xko7QBAChlUGSU_npFpSxKx_vDGuNdA8HDZFD7V6KRMIlkMTN0TrRHFkP8dBeO8TjkvwT65C9iYKRWKI7Ajw-qJOyB4eYnf4eqqsYYE1rcMWw6Y_bUpMYh2Ww5HOn-NA9q0NUSotTtXYfuKvVqxXFDzzsnG2QkzDshtKCDkWVDwKEnMwA_o18Woy3dTUzkH_o8WpC-KYaj688hVuLrUHfOrCtX_JgzUmT9iz92Nl05FupgM913O13_z0EZlAEmRNp1W1NnSQ";

let privateKey = SECRET.secret;

app.use(express.static(path.join(__dirname, '/../../client/public')));

//Seconds
let TOKEN_LENGTH = 3600;

//Handle login and send JWT-token back as JSON
app.post("/login", (req, res) => {
    let loginDao = new LoginDao(pool);
    loginDao.checkLogin(req.body.username, req.body.password, (status, data) => {
        console.log(status);
        if (status === 200){
            console.log('Login OK');
            let token = jwt.sign({username: req.body.username}, privateKey, {
                expiresIn: TOKEN_LENGTH
            });
            res.status(status);
            res.json({jwt: token});
        }
        else{
            console.log('Login not OK');
            res.status(status);
            res.json({error: 'Not authorized'});
        }
    });
});

app.get("/api/organizerID/:username", (req, res) => {
    let organizerIDDao = new OrganizerIDDao(pool);
    organizerIDDao.getOrganizerIDFromUsername(req.username, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Update the token on the server
app.post("/token", (req, res) => {
    let token = req.header['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log("Token not OK / Expired / User no longer logged in");
            res.json({error: "Token expired or user not logged in"});
        }
        else{
            let newToken = jwt.sign({username: req.body.username}, privateKey, {
                expiresIn: TOKEN_LENGTH
            });
            localStorage.setItem('access-token', newToken);
            res.json({jwt: newToken});
        }
    })
});

//TODO Activate this
/*app.use('/api', (req, res, next) => {
    let token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log('Token not OK');
            res.status(401);
            res.json({error: 'Not authorized'});
        }
        else{
            console.log('Token OK: ' + decoded.username);
            next();
        }
    })
});*/

// BUG
//TODO Not working right now
app.get("/api/bug", (request, response) => {
    console.log("request to get all bugs");
    bugDao.getAll((status, data) => {
        response.status(status);
        response.json(data);
    });
});

app.get("/api/bug/:bugID", (request, response) => {
    console.log("request to get one bug");
    bugDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.bugID);
});

// CONTACT

app.get("/api/contact/:contactID", (request, response) => {
    console.log("request to get a contact");
    contactDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID);
});

app.post("/api/contact", (request, response) => {
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

app.put("/api/contact/:contactID", (request, response) => {
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

app.delete("/api/contact/:contactID", (request, response) => {
    console.log("request to delete contact");
    contactDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID)
});

// ARTIST
app.get("/api/artist/:artistID", (request, response) => {
    console.log("request for artist");
    artistDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.artistID);
});

app.get("/api/artist/organizer/:organizerID", (request, response) => {
    console.log("request for artist per organizer");
    artistDao.getAllForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/api/artist/event/:eventID", (request, response) => {
    console.log("request for artist per event");
    artistDao.getAllForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.post("/api/artist", (request, response) => {
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

app.post("/api/document/artist", (request, response) => {
    console.log("Assign to a artistmember");

    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.documentCategory
    ];

    artistDao.addDocument((status, data) => {
        response.status(status);
        response.json(data);
    }, val)
});

app.put("/api/artist/:artistID", (request, response) => {
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

app.delete("/api/artist/:artistID", (request, response) => {
    console.log("request to delete artist");
    artistDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.artistID)
});

// CREW
app.get("/api/crew/:crewID", (request, response) => {
    console.log("request for crew");
    crewDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID);
});

app.get("/api/crew/organizer/:organizerID", (request, response) => {
    console.log("request for all crew belonging to one organizer");
    crewDao.getAllForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/api/event/crew/:eventID", (request, response) => {
    console.log("request for all crew attached to en event");
    crewDao.getAllForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.get("/api/crew/categories/organizerID", (request, response) => {
    console.log("request for all crew attached to en event");
    crewDao.getAllCategories((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.post("/api/crew", (request, response) => {
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

app.post("/api/crew-category", (request, response) => {
    console.log("request to add crew");
    let val = [
        request.body.crewCategoryName,
        request.body.organizerID
    ];
    crewDao.createOneCategory((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/crew/assign", (request, response) => {
    console.log("request to assign crew to event");
    let val = [
        request.body.eventID,
        request.body.crewCategoryID,
        request.body.crewID,
        request.body.isResponsible
    ];
    crewDao.assignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/document/crew", (request, response) => {
    console.log("Assign to a crewmember");

    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.crewID,
        request.body.documentCategory
    ];

    crewDao.addDocument((status, data) => {
        response.status(status);
        response.json(data);
    }, val)
});

app.put("/api/crew/:crewID", (request, response) => {
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


app.put("/api/responsible/:isResponsible", (request, response) => {
    console.log("set a crew member to be responsible");

    let val = [
        request.params.isResponsible,
        request.body.eventID,
        request.body.crewCategoryID,
        request.body.crewID
    ];

    crewDao.setResponsible((status, data) => {
        response.status(status);
        response.json(data);
    }, val)
});

app.delete("/api/crew/:crewID", (request, response) => {
    console.log("request to delete crew");
    crewDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID)
});

app.delete("/api/crew-category/:crewCategoryID", (request, response) => {
    console.log("request to delete crew-category");
    crewDao.deleteOneCategory((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewCategoryID)
});

app.delete("/api/crew/assign/:eventID/:crewCategoryID/:crewID", (request, response) => {
    console.log("request to unassign crew");

    crewDao.unAssignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID, request.params.crewCategoryID, request.params.crewID)
});

// EVENT

//Get all events
app.get("/api/events", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getAll((status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Get one event
app.get("/api/events/:eventID", (request, response) => {
    console.log("Express: Request for all events");
    eventDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//TODO: Check if this endpoint works with localStorage
//Get all events by status
app.get("/api/events/status/:status", (request, response) => {
    console.log("Express: Request to get all events for organizer " + localStorage.get("organizerID") + " with status " + request.params.status);
    eventDao.getByStatusForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, localStorage.get("organizerID"));
});

//Delete an event
app.delete("/api/events/:eventID", (request, response) => {
    console.log("Express: Request to delete event " + request.params.eventID);
    eventDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Publish an event
app.put("/api/events/:eventID", (request, response) => {
    console.log("Express: request to publish event " + request.params.eventID);
    eventDao.publishOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Archive an event
app.put("/api/events/:eventID", (request, response) => {
    console.log("Express: request to archive event " + request.params.eventID);
    eventDao.archiveOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Get number of events with status
app.get("/api/events/status/:status/amount", (request, response) => {
    console.log("Express: request to get number of elements with status " + request.params.status + " for organizer " + localStorage.get("organizerID"));
    eventDao.getNumberOfStatusForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, localStorage.get("organizerID"));
});

//TODO: Check if this is necessary
//Get X events with status after date
app.get("/api/events/status/:status/:amount/:date", (request, response) => {
    console.log("Express: request to get " + request.params.amount + " elements with status " + request.params.status + " after date " + request.params.date + " for organizer " + localStorage.get("organizerID"));
    eventDao.getXOfStatusAfterDateForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, request.params.amount, request.params.date, localStorage.get("organizerID"));
});

//Get all artists for event
app.get("/api/events/:eventID/artists", (request, response) => {
    console.log("Express: request to get all artists for event " + request.params.eventID);
    eventDao.getAllArtists((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Add a document to event
app.put("/api/events/:eventID/documents/:documentID", (request, response) => {
    console.log("Express: request to add a document " + request.params.documentID + "to event " + request.params.eventID);
    eventDao.addDocument((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID, request.params.documentID);
});

//get one organizer
app.get("/api/organizer/:organizerID", (require, response) => {
    console.log("Request to get a organizer");
    organizerDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
});

//ORGANIZER

// get all events for organizer
app.get("/api/organizer/:organizerID/events", (require, response) => {
    console.log("Request to get all events for a organizer");
    organizerDao.getAllEvents((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
});

// get all documents for organizer
app.get("/api/organizer/:organizerID/documents", (require, response) => {
    console.log("Request to get all documents for a organizer");
    organizerDao.getAllDocuments((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
});

// post new organizer
app.post("/api/organizer", (request, response) => {
    console.log("Request to add a organizer");
    let val = [
        request.body.username,
        request.body.password,
        request.body.contactID
    ];
    organizerDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});


// change password for organizer
app.put("/api/organizer/:organizerID", (request, response) => {
    console.log("Request to change password for organizer");
    let val = [
        request.body.password,
        request.params.organizerID
    ];
    organizerDao.changePassword((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});


//RIDER

//get a rider element
app.get("/api/rider/:riderElementID", (require, response) => {
    console.log("Request to get a rider element");
    riderDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.riderElementID);
});

//get all rider elements for an artist
app.get("/api/artist/:artistID/rider", (require, response) => {
    console.log("Request to get a rider element");
    riderDao.getAllRidersForArtist((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.artistID);
});

//get all rider elements for an artist for an event
app.get("/api/event/:eventID/artist/:artistID/rider", (require, response) => {
    console.log("Request to get a rider element");
    riderDao.getAllRidersForArtistForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.artistID, require.params.eventID);
});

//get all riders for an event
app.get("/api/event/:eventID/rider", (require, response) => {
    console.log("Request to get a rider element");
    riderDao.getAllRidersForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.eventID);
});

//create a new rider element.
// To add status and check "is done", the rider element must be updated
app.post("/api/rider", (request, response) => {
    console.log("Request to add a rider element");
    let val = [
        request.body.artistID,
        request.body.eventID,
        request.body.description,
    ];

    riderDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

//update a rider element
app.put("/api/event/:eventID/artist/:artistID/rider/:riderElementID", (request, response) => {
    console.log("Request to update a rider element");
    let val = [
        request.body.status,
        request.body.isDone,
        request.body.description,
        request.params.riderElementID,
        request.params.artistID,
        request.params.eventID
    ];
    riderDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

//delete a rider element
app.delete("/api/event/:eventID/artist/:artistID/rider/:riderElementID", (request, response) => {
    console.log("Request to delete a rider element");
    riderDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.riderElementID, request.params.artistID, request.params.eventID);
});

//DOCUMENT

app.post("/api/document/", (request, response) => {
    console.log("Express: Request to add a document");
    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.crewID,
        request.body.documentCategoryID
    ];
    documentDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.put("/api/document/:documentID", (request, response) => {
    console.log("Express: Request to change document " + request.params.documentID);
    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.crewID,
        request.body.documentCategoryID
    ];
    documentDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val, request.params.documentID);
});

app.delete("/api/document/:documentID", (request, response) => {
    console.log("Express: Request to delete document " + request.params.documentID);
    documentDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.documentID);
});

const server = app.listen(8080);
