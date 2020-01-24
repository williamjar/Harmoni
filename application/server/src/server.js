export const express = require("express");
export const cors = require("cors");
export const bodyParser = require("body-parser");
export const app = express();
export const mysql = require("mysql");
export const path = require('path');
export const multer = require('multer');
export const uuidv4 = require('uuid/v4');
export const jwt = require('jsonwebtoken');
export const SECRET = require('./cookieConfig');
export const databaseConfig = require("./databaseConfig").config;
export const fs = require('fs');
export const EventEmitter = require("events").EventEmitter;
export const body = new EventEmitter();

const pool = mysql.createPool(databaseConfig);
const artistDaoObj = require('./dao/artistDao.js');
const bugDaoObj = require('./dao/bugDao.js');
const contactDaoObj = require('./dao/contactDao.js');
const crewDaoObj = require('./dao/crewDao.js');
const eventDaoObj = require('./dao/eventDao.js');
const organizerDaoObj = require('./dao/organizerDao.js');
const riderDaoObj = require('./dao/riderDao.js');
const documentationDaoObj = require("./dao/documentationdao.js");
const loginDaoObj = require("./dao/loginDao");
const pictureDaoObj = require("./dao/pictureDao");
const ticketDaoObj = require("./dao/ticketDao");
export let artistDao = new artistDaoObj(pool);
export let bugDao = new bugDaoObj(pool);
export let contactDao = new contactDaoObj(pool);
export let crewDao = new crewDaoObj(pool);
export let documentationDao = new documentationDaoObj(pool);
export let eventDao = new eventDaoObj(pool);
export let organizerDao = new organizerDaoObj(pool);
export let riderDao = new riderDaoObj(pool);
export let loginDao = new loginDaoObj(pool);
export let pictureDao = new pictureDaoObj(pool);
export let ticketDao = new ticketDaoObj(pool);

app.use(bodyParser.json());
app.use(cors());

const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

app.get('/products/:id', function (req, res) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});

// login must be first
require('./server-login.js');

require('./server-artistVersions');

require('./server-artist.js');
require('./server-bug.js');
require('./server-contact.js');
require('./server-crew.js');
require('./server-document.js');
require('./server-event.js');
require('./server-organizer.js');
require('./server-picture.js');
require('./server-rider.js');
require('./server-ticket');
require('./server-email');

app.listen(8080);
console.log("The server is now running on port 8080");

//For testing
module.exports = app;