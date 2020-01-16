import {app,bugDao} from "./server";

//TODO Not working right now
app.get("/api/bug", (request, response) => {
    console.log("request to get all bugs");
    bugDao.getAll((status, data) => {
        response.status(status);
        response.json(data);
    });
});

app.get("/api/bug/:bugID", (request, response) => {
    console.log("request to get one bug");
    bugDao.getOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.bugID);
});

app.post('/api/bug/register/:organizerID', (req, res) => {
    bugDao.registerBug(req.params.organizerID, req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});
