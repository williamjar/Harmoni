var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cors = require('cors');
var app = express();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var EventEmitter = require("events").EventEmitter;
var body = new EventEmitter();


var server = app.listen(8080);


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
    debug: false
});


//----------------- DOCUMENTATION ---------------------

function createFoldersForUser(eventID, documentCategoryIDs) {
    fs.mkdirSync( resource_path + '/' + eventID);
    for(let i = 0; i < documentCategoryIDs.length; i++){
        fs.mkdirSync( resource_path + '/' + eventID + "/" + documentCategoryIDs[i].documentCategoryName);
    }
}
/*
const testID = 1;
const test = [1,2,3];
createFoldersForUser(testID, test);
*/

/*
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, public_path + "/resources/");
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
 */

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
});


var upload = multer({ storage: storage });

/*
//Single file
app.post('/single', upload.single('profile'), (req, res) => {
    try {
        res.send(req.file);
    }catch(err) {
        res.send(400);
    }
});
 */

//multiple files
app.post('/upload/:id', upload.array('file', 4), (req, res) => {
    try {
        res.send(req.files);
    }catch(err) {
        res.send(400);
    }
});


const Documentationdao = require("./dao/documentationdao.js");
let documentationDao = new Documentationdao(pool);

app.post("/upload/:eventID", (req, res) => {
    console.log("Fikk POST-request fra klienten");
    documentationDao.insertDocument(req.params.eventID, req.body,(status, data) => {
        res.status(status);
        res.json(data);
    });
});

app.get("/test/allDoc", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocuments((status, data) => {
        res.status(status);
        res.json(data);
    });
});


app.get("/test", (req, res) => {
    console.log("/doc: fikk request fra klient");
    documentationDao.getAllDocumentCategories((status, data) => {
        res.status(status);
        res.json(data);
        body.data = data;
        body.emit('update');
    });
});

body.on('update', function () {
    console.log(body.data); // HOORAY! THIS WORKS!
});







