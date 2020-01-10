import axios from "axios";
import {sharedComponentData} from "react-simplified";

class CreateEventStore {
    eventObject = {};


    getEvent(id){
        axios.get("", id).then(res => this.eventObject = res.data); // Under development
    }



}

export let createEventStore = sharedComponentData(new CreateEventStore());
