import {CookieStore} from "../../client/src/cookies_client/cookieStore";

var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express();
var path = require('path');
var multer = require('multer');
let jwt = require('jsonwebtoken');
let LoginDao = require('./dao/loginDao');
let SECRET = require('./cookieConfig');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();

var server = app.listen(8080);

app.use(express.static(path.join(__dirname, '/../../client/public')));

const Newsdao = require("./dao/newsdao.js");
const OrganizerIDDao = require("./dao/organizerIDDao");

const public_path = path.join(__dirname, '/../../client/public');

app.use(cors());

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

app.use(bodyParser.json());

app.use(express.static(public_path));

var pool = mysql.createPool({
    connectionLimit: 2,
    host: "mysql.stud.iie.ntnu.no",
    user: "evengu",
    password: "O7KhlwWQ",
    database: "evengu",
    debug: false,
    multipleStatements: true
});

let organizerIDDao = new OrganizerIDDao(pool);



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


const Documentationdao = require("./dao/documentationdao.js");
let documentationDao = new Documentationdao(pool);

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

/*END DOCUMENTATION*/


/*START LOGIN*/
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
        if (status === 200 && data.length > 0){
            console.log('Login OK');
            let token = jwt.sign(
                {
                    email: req.body.email,
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH)
                }, privateKey, {
                    algorithm: "RS512",
                });
            console.log("Token signed");
            jwt.verify(token, publicKey,(err, decoded) => {
                if (err){
                    console.log(err);
                }
                else{
                    console.log(decoded);
                }
            });
            console.log("Token verified");
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

//Returns organizerID by email. Needed for login, thus not part of /api/
app.get("/organizer/by-email/:email", (req, res) => {
    organizerIDDao.getOrganizerFromEmail(req.params.email, (status, data) => {
        res.status(status);
        res.json(data);
    })
});

//Update the token on the server, and "returns" it in the res.json().jwt
app.post("/token", (req, res) => {
    let token = req.headers['x-access-token'];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log("Token not OK / Expired / User no longer logged in");
            res.json({error: err});
        }
        else{
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
    let token = req.headers["x-access-token"];
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err){
            console.log('Token not OK');
            res.status(401);
            res.json({error: err});
        }
        else{
            console.log('Token OK for: ' + decoded.email);
            CookieStore.currentToken = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (TOKEN_LENGTH),
                    email: decoded.email
                }, privateKey, {
                    algorithm: "RS512",
                });
            res.json({jwt: CookieStore.currentToken, for: decoded.email});
            next();
        }
    })
});

app.get('/api/test', () => {
    console.log("Testing /api/test");
});

/*END LOGIN*/








