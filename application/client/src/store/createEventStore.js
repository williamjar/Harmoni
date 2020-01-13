import axios from "axios";
import {sharedComponentData} from "react-simplified";

class CreateEventStore {
    eventObject = new Event();


    getEvent(id){
        axios.get("", id).then(res => this.eventObject.eventID = res.data.eventID); // Under development
    }

    /* PerformersTab */
    getPerformers(){
        axios.get("").then();
    }

    getRidersFromArtist(artistID){
        axios.get("", artistID).then(res => this.eventObject = res.data);
    }




}

export let createEventStore = sharedComponentData(new CreateEventStore());
