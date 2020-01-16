import {app,artistDao} from "./server";

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
