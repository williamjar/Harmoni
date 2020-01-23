import {app, documentationDao, jwt, riderDao} from "./server";
import {CookieStore} from "../../client/src/store/cookieStore";
const publicKey = require("./cookieConfig").publicKey;
const privateKey = require("./cookieConfig").privateKey;

app.use('/artistapi', (req, res, next) => {
    if (req.headers["x-access-token"]) {
        let token = req.headers["x-access-token"];
        try {
            const artistID = jwt.decode(token, publicKey).artistID;
            console.log('Token OK for: ' + artistID);
            next();
        } catch (e) {
            console.log('Token not OK');
            res.status(401);
            res.json({error: e});
        }
    } else {
        res.json({error: "No token given for /artistapi"});
    }
});

app.get("/decodeArtistToken", (req, res) => {
    try{
        console.log(req.headers);
        const token = req.headers['x-access-token'];
        console.log(token);
        const decoded = jwt.decode(token, publicKey);
        if (decoded === null){
            res.send({error: "Not valid"});
        }
        else{
            res.send({data: decoded});
        }

    }
    catch (e) {
        console.log();
        res.send({error: e})
    }
});

app.get("/artistapi/artist/documents/:eventID/:artistID", (request, response) => {
    console.log("Request to get all documents for an artist by event");
    documentationDao.getDocumentsForArtist(request.params.eventID, request.params.artistID, (status, data) => {
        response.status(status);
        response.json(data);
    })
});

//get all rider elements for an artist for an event
app.get("/artistapi/event/:eventID/artist/:artistID/rider", (require, response) => {
    console.log("Request to get a rider element");
    riderDao.getAllRidersForArtistForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.artistID, require.params.eventID);
});

//create a new rider element.
// To add status and check "is done", the rider element must be updated
app.post("/artistapi/rider", (request, response) => {
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

app.post("/artistapi/document", (request, response) => {
    console.log("Express: Request from artist to add a document");
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

app.delete("/artistapi/rider/:eventID/:artistID/:riderID", (request, response) => {
    console.log("Request from artist to delete rider");
    riderDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.riderID, request.params.artistID, request.params.eventID);
});