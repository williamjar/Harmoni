import {app, artistDao, documentationDao} from "./server";

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

app.get("/api/artist/documents/:eventID/:artistID", (request, response) => {
    console.log("Request to get all documents for an artist by event");
    documentationDao.getDocumentsForArtist(request.params.eventID, request.params.artistID, (status, data) => {
        response.status(status);
        response.json(data);
    })
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
        request.params.artistID,
        /*request.body.organizerID,
        request.body.contactID,*/
    ];

    artistDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/api/artist/:contactID", (request, response) => {
    console.log("request to delete artist");
    artistDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID)
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

app.get("/api/event/:eventID/artist/:artistID/artistEventInfo", (request, response) => {
    console.log("Express: request to get artistEventInfo");

    artistDao.getArtistEventInfo((status, data) =>{
        response.status(status);
        response.json(data);
    }, [request.params.eventID, request.params.artistID]);
});

app.put("/api/event/:eventID/artist/:artistID/artistEventInfo", (request, response) => {
    console.log("Express: request to update artistEventInfo");

    artistDao.updateArtistEventInfo((status, data) =>{
        response.status(status);
        response.json(data);
    }, [request.body.contractSigned, request.body.hasBeenPaid, request.params.eventID, request.params.artistID]);
});
