import {app,contactDao} from "./server";

app.get("/api/contact/:contactID", (request, response) => {
    console.log("request to get a contact");
    contactDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID);
});

//TODO: potensielt sikkerhetshull
app.post("/contact", (request, response) => {
    console.log("request to add contact");
    let val = [
        request.body.username,
        request.body.phone,
        request.body.email
    ];

    contactDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.post("/api/contact", (request, response) => {
    console.log("request to add contact");
    let val = [
        request.body.username,
        request.body.phone,
        request.body.email
    ];
    contactDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.put("/api/contact/:contactID", (request, response) => {
    console.log("request to update contact");
    let val = [
        request.body.contactName,
        request.body.phone,
        request.body.email,
        request.params.contactID
    ];

    contactDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/api/contact/:contactID", (request, response) => {
    console.log("request to delete contact");
    contactDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.contactID)
});


app.put("/api/contact/:contactID/change/phoneNumber", (request, response) => {
    console.log("Request to change password for organizer");

    let val = [
        request.body.phone,
        request.params.contactID
    ];

    contactDao.changePhoneNumber((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

