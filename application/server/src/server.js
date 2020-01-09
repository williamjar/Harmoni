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

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, public_path + "/resources");
    },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});

var upload = multer({ storage: storage });

app.post('/single', upload.single('profile'), (req, res) => {
    try {
        res.send(req.file);
    }catch(err) {
        res.send(400);
    }
});


let newsDao = new Newsdao(pool);

app.get("/news", (req, res) => {
    console.log("/news: fikk request fra klient");
    newsDao.getAll((status, data) => {
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

