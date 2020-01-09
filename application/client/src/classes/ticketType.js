export class TicketType{
    constructor(ticketTypeID, price, amount, releaseDate, releaseTime, hasEndDate, endDate, endTime, description){
        this.ticketTypeID = ticketTypeID;
        this.price = price;
        this.amount = amount;
        this.releaseDate = releaseDate;
        this.releaseTime = releaseTime;
        this.hasEndDate = hasEndDate;
        if (hasEndDate){
            this.endDate = endDate;
            this.endTime = endTime;
        }
        else{
            this.endDate = null;
            this.endTime = null;
        }
        this.description = description;
    }

    static getTestTicketTypes(){
        let endingTicket = new TicketType(0, 100, 150, '20200801', '2200', true, '20230218', '2300', 'VIP ståplasser');
        //let nonEndingTicket = new TicketType(1, 110, 2000, '20190202', '0000', false, null, null, 'Damn expensive tickets');
        return [endingTicket, /*nonEndingTicket*/];
    }
}