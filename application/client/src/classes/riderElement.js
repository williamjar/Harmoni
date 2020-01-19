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
        let elementOne = new RiderElement(0, 'Almost done, 4 more hours of drying...', false, '7.5 hours of drying the cheese before serving');
        let elementTwo = new RiderElement(1, null, true, 'Sour water');
        return [elementOne, elementTwo];
    }
}