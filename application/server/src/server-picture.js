import {app, fs, pictureDao} from "./server";

//Insert picture
app.post("/api/picture/insert", (request, response) => {
    console.log("Request to add a picture link");
    pictureDao.createOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.body.pictureLink);
});

//Delete picture
app.delete("/api/picture/delete/:pictureID", (request, response) => {
    console.log("Request to delete a picture");
    pictureDao.deleteOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.pictureID);
});

//Update picture
app.put("/api/picture/update/:pictureID", (request, response) => {
    console.log("Request to update a picture");
    pictureDao.updateOne((status, data) => {
        response.status(status);
        response.json(data);
    }, request.body.pictureLink, request.params.pictureID);
});

//Get one picture
app.get("/api/picture/:pictureID", (require, response) => {
    console.log("Request to get a rider element");
    pictureDao.getPicture((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.pictureID);
});