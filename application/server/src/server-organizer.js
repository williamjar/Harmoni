import {app,organizerDao} from "./server";

//get one organizer without api
app.get("/organizer/:organizerID", (require, response) => {
    console.log("Request to get a organizer");
    organizerDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
    console.log(require.params.organizerID);
});


//get one organizer with api
app.get("/api/organizer/:organizerID", (require, response) => {
    console.log("Request to get a organizer");
    organizerDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
    console.log(require.params.organizerID);
});

//ORGANIZER

// get all events for organizer
app.get("/api/organizer/:organizerID/events", (require, response) => {
    console.log("Request to get all events for a organizer");
    organizerDao.getAllEvents((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
});

// get all documents for organizer
app.get("/api/organizer/:organizerID/documents", (require, response) => {
    console.log("Request to get all documents for a organizer");
    organizerDao.getAllDocuments((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.organizerID);
});

// post new organizer
app.post("/organizer", (request, response) => {
    console.log("Request to add a organizer");
    let val = [
        request.body.username,
        request.body.password,
        request.body.contactID
    ];

    console.log(request.body);

    organizerDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});


// change password for organizer
app.put("/api/organizer/:organizerID/change/password", (request, response) => {
    console.log("Request to change password for organizer");
    let val = [
        request.body.password,
        request.params.organizerID
    ];
    organizerDao.changePassword((status, data) => {
        console.log(status);
        console.log(data);
        response.status(status);
        response.json(data);
    }, val);
});

//TODO: Header error
//Change username for organizer
app.put("/api/organizer/:organizerID/change/username", (request, response) => {
    console.log("Request to change password for organizer");
    let val = [
        request.body.username,
        request.params.organizerID
    ];
    organizerDao.changeUsername(val,(status, data) => {
        response.status(status);
        response.json(data);
    });
});

