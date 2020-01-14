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
const databaseConfig = require("./databaseConfig").config;
const fs = require('fs');
const EventEmitter = require("events").EventEmitter;
const body = new EventEmitter();

import {CookieStore} from "../../client/src/store/cookieStore";

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

const a = require('./server-artist.js');
/**
const b = require('./server-bug.js');
const c = require('./server-contact.js');
const d = require('./server-crew.js');
const e = require('./server-document.js');
const f = require('./server-event.js');
const g = require('./server-login.js');
const h = require('./server-organizer'.js);
const i = require('./server-picture.js');
const j = require('./server-rider.js');
 */

app.use(cors);

const server = app.listen(8080);







