import {app, bugDao, ticketDao} from "./server";


// returns one bug with a specific bugID
app.get("/api/bug/:bugID", (request, response) => {
    console.log("request to get all bugs");
    bugDao.getOneBug((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.bugID);
});

// returns all bugs reported from one organizer.
app.get("/api/bug/organizer/:organizerID", (request, response) => {
    console.log("request to get one bug");
    bugDao.getAllBugsFromOrganizer((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.organizerID);
});

// used to report new bugs.
app.post("/api/bug/register/:organizerID", (request, response) => {
    console.log("Request to add a bug");

    let val =[
        request.body.description,
        request.params.organizerID,
    ];

    bugDao.registerBug((status, data)=>{
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/api/bug/delete/:bugID", (request, response) => {
    console.log("Express: Request to delete reported bug " + request.params.bugID);
    bugDao.deleteBug((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.bugID);
});


