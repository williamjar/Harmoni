export const express = require("express");
export const bodyParser = require("body-parser");
export const app = express();
export const cors = require("cors");
export const mysql = require("mysql");
export const path = require('path');
export const multer = require('multer');
export const jwt = require('jsonwebtoken');
export const LoginDao = require('./dao/loginDao');
export const SECRET = require('./cookieConfig');
export const databaseConfig = require("./databaseConfig").config;
export const fs = require('fs');
export const EventEmitter = require("events").EventEmitter;
export const body = new EventEmitter();

export const pool = mysql.createPool(databaseConfig);
export const artistDaoObj = require('./dao/artistDao.js');
export const bugDaoObj = require('./dao/bugDao.js');
export const contactDaoObj = require('./dao/contactDao.js');
export const crewDaoObj = require('./dao/crewDao.js');
export const documentDaoObj = require('./dao/documentDao.js');
export const eventDaoObj = require('./dao/eventDao.js');
export const organizerDaoObj = require('./dao/organizerDao.js');
export const riderDaoObj = require('./dao/riderDao.js');
export const documentationDaoObj = require("./dao/documentationdao.js");
export const loginDaoObj = require("./dao/loginDao");
export const pictureDaoObj = require("./dao/pictureDao");
export let artistDao = new artistDaoObj(pool);
export let bugDao = new bugDaoObj(pool);
export let contactDao = new contactDaoObj(pool);
export let crewDao = new crewDaoObj(pool);
export let documentDao = new documentDaoObj(pool);
export let documentationDao = new documentationDaoObj(pool);
export let eventDao = new eventDaoObj(pool);
export let organizerDao = new organizerDaoObj(pool);
export let riderDao = new riderDaoObj(pool);
export let loginDao = new loginDaoObj(pool);
export let pictureDao = new pictureDaoObj(pool);

const a = require('./server-artist.js');
const b = require('./server-bug.js');
const c = require('./server-contact.js');
const d = require('./server-crew.js');
const e = require('./server-document.js');
const f = require('./server-event.js');
const g = require('./server-login.js');
const h = require('./server-organizer.js');
const i = require('./server-picture.js');
const j = require('./server-rider.js');

const public_path = path.join(__dirname, '/../../client/public');

app.use(cors);
app.use(bodyParser.json());
app.use(express.static(public_path));

const server = app.listen(8080);