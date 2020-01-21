import {app,crewDao} from "./server";

// CREW
app.get("/api/crew/:crewID", (request, response) => {
    console.log("request for crew");
    crewDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID);
});

app.get("/api/crew/organizer/:organizerID", (request, response) => {
    console.log("request for all crew belonging to one organizer");
    crewDao.getAllForOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/api/crew/categories/:organizerID", (request, response) => {
    console.log("request for all crew categories attached to organizer");
    crewDao.getAllCategories((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

app.get("/api/crew/event/:eventID", (request, response) => {
    console.log("Express: request for all crew  attached to event");

    let val = [
        request.params.eventID
    ];

    crewDao.getAllForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.get("/api/crew/event/:eventID/categories/:crewID", (request, response) => {
    console.log("request for all crew categories attached to a crew member for an event");
    crewDao.getAllCategoriesForOneForEvent((status,data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID, request.params.eventID);
});

app.get("/api/crew/event/:eventID/categories", (request, response) => {
    console.log("request for all crew categories for an event");
    crewDao.getAllCategoriesForEvent((status,data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID);
});

app.post("/api/crew", (request, response) => {
    console.log("request to add crew");
    let val = [
        request.body.description,
        request.body.organizerID,
        request.body.contactID
    ];
    crewDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/crew-category", (request, response) => {
    console.log("request to add crew");
    let val = [
        request.body.crewCategoryName,
        request.body.organizerID
    ];
    crewDao.createOneCategory((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/crew/assign", (request, response) => {
    console.log("request to assign crew to event");
    let val = [
        request.body.eventID,
        request.body.crewCategoryID,
        request.body.crewID,
        request.body.isResponsible
    ];
    crewDao.assignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/document/crew", (request, response) => {
    console.log("Assign to a crewmember");

    let val = [
        request.body.eventID,
        request.body.documentName,
        request.body.documentLink,
        request.body.crewID,
        request.body.documentCategoryID
    ];

    crewDao.addDocument((status, data) => {
        response.status(status);
        response.json(data);
    }, val)
});

app.put("/api/crew/:crewID", (request, response) => {
    console.log("request to update crew");

    let val = [
        request.body.description,
        request.params.crewID
    ];

    crewDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});


app.put("/api/responsible/:isResponsible", (request, response) => {
    console.log("set a crew member to be responsible");

    let val = [
        request.params.isResponsible,
        request.body.eventID,
        request.body.crewCategoryID,
        request.body.crewID
    ];

    crewDao.setResponsible((status, data) => {
        response.status(status);
        response.json(data);
    }, val)
});

app.delete("/api/crew/:crewID", (request, response) => {
    console.log("request to delete crew");
    crewDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewID)
});

app.delete("/api/crew-category/:crewCategoryID", (request, response) => {
    console.log("request to delete crew-category");
    crewDao.deleteOneCategory((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.crewCategoryID)
});

app.delete("/api/crew/assign/:eventID/:crewCategoryID/:crewID", (request, response) => {
    console.log("request to unassign crew");

    crewDao.unAssignOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID, request.params.crewCategoryID, request.params.crewID)
});
