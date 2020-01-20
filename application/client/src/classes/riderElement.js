export class RiderElement{

    isModified = false;

    constructor(riderID, artistID, status, isDone, description){
        this.riderID = riderID;
        this.artistID = artistID;
        this.status = status;
        this.isDone = isDone;
        this.description = description;
    }

    static getTestRiderElement(){
        let elementOne = new RiderElement(0, 0, '7.5 hours of drying the cheese before serving', false, "Cheese");
        let elementTwo = new RiderElement(1, 0, null, true, null);
        return [elementOne, elementTwo];
    }
}