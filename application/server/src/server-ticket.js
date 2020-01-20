import {app, ticketDao} from "./server";

//Ticket
//Get one ticket
app.get("/api/ticket/:ticketTypeID", (require, response) => {
    console.log("Request to get a ticketType");
    ticketDao.getOneTicket((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.ticketTypeID);
});

//Get all tickets for an event
app.get("/api/ticket/allTickets/:eventID", (require, response) => {
    console.log("Request to get a list with tickets  element");
    ticketDao.getAllTicketsForEvent((status, data) => {
        response.status(status);
        response.json(data);
    }, require.params.eventID);
});

//add one ticket
app.post("/api/ticket/insert", (request, response) => {
    console.log("Request to add a ticket");

    let val =[
        request.body.eventID,
        request.body.ticketTypeName,
        request.body.price,
        request.body.amount,
        request.body.releaseDate,
        request.body.releaseTime,
        request.body.hasEndDate,
        request.body.endDate,
        request.body.endTime,
        request.body.description
    ];

    ticketDao.addTicket((status, data)=>{
        response.status(status);
        response.json(data);
    }, val);
});


app.put("/ticket/:ticketTypeID", (request, response) => {
    console.log("Express: Request to change ticket " + request.params.ticketTypeID);
    let val = [
        request.body.ticketTypeName,
        request.body.price,
        request.body.amount,
        request.body.releaseDate,
        request.body.releaseTime,
        request.body.endDate,
        request.body.endTime,
        request.body.description,
        request.params.ticketTypeID
    ];
    ticketDao.updateTicket((status, data) => {
        response.status(status);
        response.json(data);
    }, val);
});

app.delete("/api/ticket/:eventID/:ticketTypeID", (request, response) => {
    console.log("Express: Request to delete ticket " + request.params.eventID + request.params.ticketTypeID);
    ticketDao.deleteTicket((status, data) => {
        response.status(status);
        response.json(data);
    }, request.params.eventID, request.params.ticketTypeID);
});
