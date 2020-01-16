import {app,riderDao} from "./server";

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
