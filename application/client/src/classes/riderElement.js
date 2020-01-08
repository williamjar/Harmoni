class RiderElement{
    constructor(riderID, status, isDone, description){
        this.riderID = riderID;
        this.status = status;
        this.isDone = isDone;
        this.description = description;
    }

    static getTestRiderElement(){
        let elementOne = new RiderElement(0, 'Almost done, 4 more hours of drying...', 0, '7.5 hours of drying the cheese before serving');
        let elementTwo = new RiderElement(1, null, 1, 'Sour water');
        return [elementOne, elementTwo];
    }
}