const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const mysql = require("mysql");

const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const jwt = require('jsonwebtoken');
const LoginDao = require('./dao/loginDao');
const SECRET = require('./cookieConfig');
const databaseConfig = require("./databaseConfig").config;
const fs = require('fs');
const EventEmitter = require("events").EventEmitter;
const body = new EventEmitter();

import {CookieStore} from "../../client/src/store/cookieStore";

app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool(databaseConfig);

const artistDaoObj = require('./dao/artistDao.js');
const bugDaoObj = require('./dao/bugDao.js');
const contactDaoObj = require('./dao/contactDao.js');
const crewDaoObj = require('./dao/crewDao.js');
const documentDaoObj = require('./dao/documentDao.js');
const eventDaoObj = require('./dao/eventDao.js');
const organizerDaoObj = require('./dao/organizerDao.js');
const riderDaoObj = require('./dao/riderDao.js');
const documentationDaoObj = require("./dao/documentationdao.js");
const loginDaoObj = require("./dao/loginDao");
const pictureDaoObj = require("./dao/pictureDao");
const ticketDaoObj = require("./dao/ticketDao.js");
let artistDao = new artistDaoObj(pool);
let bugDao = new bugDaoObj(pool);
let contactDao = new contactDaoObj(pool);
let crewDao = new crewDaoObj(pool);
let documentDao = new documentDaoObj(pool);
let documentationDao = new documentationDaoObj(pool);
let eventDao = new eventDaoObj(pool);
let organizerDao = new organizerDaoObj(pool);
let riderDao = new riderDaoObj(pool);
let loginDao = new loginDaoObj(pool);
let pictureDao = new pictureDaoObj(pool);
let ticketDao = new ticketDaoObj(pool);

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

app.use(bodyParser.json());

app.use(express.static(public_path));

//----------------- BUG ---------------------
//Request to register bug
app.post('/api/bug/register/:organizerID', (req, res) => {
    bugDao.registerBug(req.params.organizerID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//----------------- DOCUMENTATION ---------------------


function deleteFile(path) {
    try {
        fs.unlink(path, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
    } catch (e) {
        console.log("Error, could not delete file:" + e);
    }
}

function deleteAllFilesInFolder(path, callback) {
    fs.readdir(path, (err, files) => {
        if (err) console.log(err);
        for (const file of files) {
            fs.unlink(path + '/' + file, err => {
                if (err) console.log(err);
            });
        }
    });
    callback();
}

function ensureFolderExists(path, mask, callback){
    if (typeof mask == 'function'){
        callback = mask;
        mask = 0o777;
    }
    fs.mkdir(path, mask, function(err){
        if (err){
            if(err.code === 'EEXIST'){
                callback(null);
            }
            else{
                callback(err);
            }
        }
        else{
            callback(err);
        }
    })
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const eventID = req.params.eventID;
        const documentCategoryID = req.params.documentCategoryID;

        ensureFolderExists('./resources/' + eventID, 0o744, err => {
            if (err){
                console.log("Could not create folder for event " + eventID);
            }
            else{
                ensureFolderExists('./resources/' + eventID + '/' + documentCategoryID, 0o744, err => {
                    if (err){
                        console.log("Could not create folder for event " + eventID + " - category " + documentCategoryID);
                    }
                    else{
                        console.log("Destination set for ./resources/" + eventID + "/" + documentCategoryID);
                        cb(null, './resources/' + eventID + '/' + documentCategoryID);
                    }
                })
            }
        });
    },

    filename: (req, file, cb) => {
        const newFilename = uuidv4(path.extname(file.originalname)) + "_" + file.originalname;
        console.log("Creating new file " + newFilename);
        cb(null, newFilename);
    }
});

const pictureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureFolderExists('./resources/profilePictures', 0o744, err => {
            if (err){
                console.log("Could not create folder for profile pictures");
            }
            else{
                console.log("Destination set for ./resources/profilePictures");
                cb(null, './resources/profilePictures');
            }
        });
    },
    filename: (req, file, cb) => {
        const newFilename = uuidv4(path.extname(file.originalname)) + "_" + file.originalname;
        console.log("Creating new file " + newFilename);
        cb(null, newFilename);
    }
});


//init upload
const uploadUserPicture = multer({
    storage: pictureStorage,
    limits: {fileSize: 5000000000},
    fileFilter: (req, file, cb) => {
        console.log("Checking file filter");
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
            cb(null, true);
        } else {
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

const fileUpload = multer({storage: fileStorage});

// PICTURE

//Save picture to server
app.post("/api/file/picture",  uploadUserPicture.single('selectedFile'), (req, res) => {
    try {
        res.send({name: req.file.filename, path: req.file.path});
    } catch (err) {
        res.send(400);
    }
});

app.post("/api/organizer/picture", (request, response) => {
    console.log("Request to add a picture");
    pictureDao.insertPicture(request.body.path, (status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Delete picture
app.delete("/api/organizer/picture/delete/:pictureID", (request, response) => {
    console.log("Request to delete a picture");
    pictureDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.pictureID);
});

//Update picture
app.put("/api/organizer/picture/update/:pictureID", (request, response) => {
    console.log("Request to update a picture");
    pictureDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.body.pictureLink, request.params.pictureID);
});

//Update the picture on the organizer
app.put("/api/organizer/picture/:organizerID", (request, response) => {
    console.log("Request to update a picture for an organizer");
    organizerDao.changePicture(request.body.pictureID, request.params.organizerID, (status, data) => {
        response.status(status);
        response.json(data);
    });
});

//Get one picture
app.get("/api/organizer/picture/:pictureID", (require, response) => {
    console.log("Request to get the picture of an organizer");
    pictureDao.getPicture((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.pictureID);
});

app.post("/api/file/document/:eventID/:documentCategoryID", fileUpload.single('selectedFile'), (req, res) => {
    console.log("Request to create document");
    console.log(req.file);
    res.send({name: req.file.filename, path: req.file.path});
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
    documentationDao.getOneDocument(req.params.eventID, req.params.documentID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.delete("/api/:eventID/documents/:documentCategory/:fileName", (req, res) => {
    documentationDao.deleteDocument(req.params.eventID, req.params.documentID, (status, data) => {
        res.status(status);
        res.json(data);
        //Server stops if file dont exists
        deleteFile(resource_path + req.params.eventID + "/" + req.params.documentCategory + "/" + req.params.fileName)
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.getDocumentsByCategory(req.params.eventID, req.params.documentCategoryID, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.put("/api/:eventID/documents/category/:documentCategoryID", (req, res) => {
    documentationDao.changeDocumentCategory(req.params.eventID, req.params.documentCategoryID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create", (req, res) => {
    documentationDao.insertDocument(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/artist", (req, res) => {
    documentationDao.insertDocumentArtist(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.post("/api/:eventID/documents/create/crew", (req, res) => {
    documentationDao.insertDocumentCrew(req.params.eventID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

// START LOGIN
let privateKey = SECRET.privateKey;
let publicKey = SECRET.publicKey;

//Seconds
let TOKEN_LENGTH = 3600;

//Handle login and send JWT-token back as JSON
app.post("/login", (req, res) => {
    console.log("Logging in serverside...");
    let loginDao = new LoginDao(pool);
    loginDao.checkLogin(req.body.email, req.body.password, (status, data) => {
        console.log(status);
        console.log(data);
        if (status === 200 && data.length > 0) {
            console.log('Login OK');
            let token = jwt.sign(
                {
                    email: req.body.email,
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH)
                }, privateKey, {
                    algorithm: "RS512",
                });
            console.log("Token signed");
            jwt.verify(token, publicKey, (err, decoded) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(decoded);
                }
            });
            console.log("Token verified");
            res.status(status);
            res.json({jwt: token});
        } else {
            console.log('Login not OK');
            res.status(status);
            res.json({error: 'Not authorized'});
        }
    });
});

app.get("/organizer/username/:username", (req, res) => {
    loginDao.checkUserExists(req.params.username, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

//Returns organizerID by email. Needed for login, thus not part of /api/
app.get("/organizer/by-email/:email", (req, res) => {
    organizerDao.getOrganizerFromEmail(req.params.email, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

//Update the token on the server, and "returns" it in the res.json().jwt
app.post("/token", (req, res) => {
    let token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            console.log("Token not OK / Expired / User no longer logged in");
            res.json({error: err});
        } else {
            console.log("Token accepted. Updating token clientside");
            let newToken = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH),
                    email: req.body.email
                }, privateKey, {
                    algorithm: "RS512",
                });
            CookieStore.currentToken = newToken;
            res.json({jwt: newToken, for: decoded.email});
        }
    })
});

app.use('/api', (req, res, next) => {
    console.log("Testing /api");
    let token;
    if (req.headers["x-access-token"]){
        token = req.headers["x-access-token"];
    } else {
        token = CookieStore.currentToken;
    }
    console.log("Token in /api " + token);
    try {
        jwt.verify(token, publicKey);
        let email = jwt.decode(token, publicKey).email;
        console.log('Token OK for: ' + email);
        CookieStore.currentToken = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH),
                email: email
            }, privateKey, {
                algorithm: "RS512",
            });
        console.log("Token after /api " + CookieStore.currentToken);
        next();
    } catch (e) {
        console.log('Token not OK');
        res.status(401);
        res.json({error: e});
    }
});

app.get('/api/test', () => {
    console.log("Testing /api/test");
});

// END LOGIN

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

//TODO: potensielt sikkerhetshull
app.post("/api/contact", (request, response) => {
    console.log("request to add contact");
    let val = [
        request.body.username,
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


app.put("/api/contact/:contactID/change/phoneNumber", (request, response) => {
    console.log("Request to change password for organizer");

    let val = [
        request.body.phone,
        request.params.contactID
    ];

    contactDao.changePhoneNumber((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
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

app.post("/api/artist/assign", (request, response) => {
    console.log("request to assign artist to event");
    let val = [
        request.body.eventID,
        request.body.artistID
    ];
    artistDao.assignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
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

app.delete("/api/artist/assign/:eventID/:artistID", (request, response) => {
    console.log("request to unassign artist");

    artistDao.unAssignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, [request.params.eventID, request.params.artistID])
});

app.get("/api/artist-genres", (request, response) => {
    console.log("request to get all genres");

    artistDao.getAllGenres((status, data) => {
        response.status(status);
        response.json(data);
    })
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

app.get("/api/crew/categories/:organizerID", (request, response) => {
    console.log("request for all crew categories attached to organizer");
    crewDao.getAllCategories((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/api/crew/event/:eventID", (request, response) => {
    console.log("Express: request for all crew  attached to event");

    let val = [
        request.params.eventID
    ];

    crewDao.getAllForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.get("/api/crew/event/:eventID/categories/:crewID", (request, response) => {
    console.log("request for all crew categories attached to a crew member for an event");
    crewDao.getAllCategoriesForOneForEvent((status,data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID, request.params.eventID);
});

app.get("/crew/event/:eventID/categories/", (request, response) => {
    console.log("request for all crew categories for an event");
    crewDao.getAllCategoriesForEvent((status,data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.post("/api/crew", (request, response) => {
    console.log("request to add crew");
    let val = [
        request.body.description,
        request.body.organizerID,
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
        request.body.documentCategoryID
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

//Create one event
app.post("/api/events", (request, response) => {
    console.log("Express: Request to create an event");

    eventDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, [request.body.eventName, request.body.startDate, request.body.endDate, request.body.startTime, request.body.endTime, request.body.address, request.body.town, request.body.zipCode, request.body.status, request.body.description, request.body.publishDate, request.body.publishTime, request.body.organizerID, request.body.eventTypeID, request.body.pictureID]);
});

//Update event
app.put("/api/events/:eventID", (request, response) => {
    console.log("Express: Request to update an event");
    eventDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, [request.body.eventName, request.body.startDate, request.body.endDate, request.body.startTime, request.body.endTime, request.body.address, request.body.town, request.body.zipCode, request.body.status, request.body.description, request.body.publishDate, request.body.publishTime, request.body.eventTypeID, request.body.pictureID, request.params.eventID]);
});

//Get all events for organizer
app.get("/api/events/organizer/:organizerID", (request, response) => {
    console.log("Express: Request to get all events for organizer " + request.params.organizerID);
    eventDao.getAllForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

//TODO: Check if this endpoint works with localStorage
//Get all events by status
app.get("/api/events/status/:status", (request, response) => {
    console.log("Express: Request to get all events for organizer " + CookieStore.currentUserID + " with status " + request.params.status);
    eventDao.getByStatusForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, CookieStore.currentUserID);
});

//Delete an event
app.delete("/api/events/:eventID", (request, response) => {
    console.log("Express: Request to delete event " + request.params.eventID);
    eventDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

//Change event status
app.put("/api/events/:eventID/status/:status", (request, response) => {
    console.log("Express: request to archive event " + request.params.eventID);
    eventDao.setStatus((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID, request.params.status);
});

//Get number of events with status
app.get("/api/events/status/:status/amount", (request, response) => {
    console.log("Express: request to get number of elements with status " + request.params.status + " for organizer " + CookieStore.currentUserID);
    eventDao.getNumberOfStatusForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, CookieStore.currentUserID);
});

//TODO: Check if this is necessary
//Get X events with status after date
app.get("/api/events/status/:status/:amount/:date", (request, response) => {
    console.log("Express: request to get " + request.params.amount + " elements with status " + request.params.status + " after date " + request.params.date + " for organizer " + CookieStore.currentUserID);
    eventDao.getXOfStatusAfterDateForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.status, request.params.amount, request.params.date, CookieStore.currentUserID);
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

//get one organizer without api
app.get("/organizer/:organizerID", (require, response) => {
    console.log("Request to get a organizer");
    organizerDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
    console.log(require.params.organizerID);
});

//get one organizer with api
app.get("/api/organizer/:organizerID", (require, response) => {
    console.log("Request to get a organizer");
    organizerDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
    console.log(require.params.organizerID);
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
app.post("/organizer", (request, response) => {
    console.log("Request to add a organizer");
    let val = [
        request.body.username,
        request.body.password,
        request.body.contactID
    ];

    console.log(request.body);

    organizerDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});


// change password for organizer
app.put("/api/organizer/:organizerID/change/password", (request, response) => {
    console.log("Request to change password for organizer");
    let val = [
        request.body.password,
        request.params.organizerID
    ];
    organizerDao.changePassword((status, data) => {
        console.log(status);
        console.log(data);
        response.status(status);
        response.json(data);
    }, val);
});

//TODO: Header error
//Change username for organizer
app.put("/api/organizer/:organizerID/change/username", (request, response) => {
    console.log("Request to change password for organizer");
    let val = [
        request.body.username,
        request.params.organizerID
    ];
    organizerDao.changeUsername(val,(status, data) => {
        response.status(status);
        response.json(data);
    });
});

app.put("/organizer/:organizerID/change/picture", (request, response) => {
    console.log("Request to change profile picture for organizer");
    let val = [
        request.body.pictureID,
        request.params.organizerID
    ];
    organizerDao.changeOrganizerProfilePicture((status, data) => {
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

app.post("/api/document", (request, response) => {
    console.log("Express: Request to add a document");
    documentationDao.insertDocument(request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.artistID,
        request.body.crewID,
        request.body.documentCategoryID,
        (status, data) => {
            response.status(status);
            response.json(data);
        });
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






//Ticket
//Get one ticket
app.get("/ticket/:ticketTypeID", (require, response) => {
    console.log("Request to get a ticketType");
    ticketDao.getOneTicket((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.ticketTypeID);
});

//Get all tickets for an event
app.get("/ticket/allTickets/:eventID", (require, response) => {
    console.log("Request to get a rider element");
    ticketDao.getAllTicketsForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.eventID);
});

//add one ticket
app.post("/ticket/insert", (request, response) => {
    console.log("Request to add a ticket");

    let val =[
        request.body.eventID,
        request.body.ticketTypeName,
        request.body.price,
        request.body.amount,
        request.body.releaseDate,
        request.body.releaseTime,
        request.body.hasEndDate,
        request.body.endDate,
        request.body.endTime,
        request.body.description
    ];

    ticketDao.addTicket((status, data)=>{
        response.status(status);
        response.json(data);
    }, val);
});




