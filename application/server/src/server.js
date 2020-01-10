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

app.use('/api', (req, res, next) => {
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
});








