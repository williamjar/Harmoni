import axios from "axios";

const axiosConfig = require("./axiosConfig");
import RiderElement from "../classes/riderElement"


//COLUMNS DB
//riderElementID
//artistID
//eventID
//status
//isDone
//description


export class Rider {
    //get a rider element
    getRider(riderID) {
        axios.get(axiosConfig.root + '/api/rider/' + riderID)
            .then(response => {
                return new RiderElement(response.data[0].riderID, response.data[0].artistID,
                    response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                    response.data[0].description);
            }
        )
            .catch(error => console.log(error));
    }

    //get all rider elements for an artist
    getAllRiderElementsFromArtist(artistID) {
        let allRiderElementsFromArtist = [];
        axios.get(axiosConfig.root + '/api/artist/' + artistID + '/rider').then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    allRiderElementsFromArtist.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description));
                }
            }
        )
            .catch(error => console.log(error));
        return allRiderElementsFromArtist;
    }

    //get all rider elements for an artist for an event
    getAllRiderElementsFromArtistAndEvent(eventID, artistID){
        let allRiderElementsFromArtistAndEvent = [];
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider')
            .then(response => {
                for(let i = 0; i < response.data.length; i++){
                    allRiderElementsFromArtistAndEvent.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description));
                }
            }
       )
            .catch(error => console.log(error));
        return allRiderElementsFromArtistAndEvent;
    }

    //get all riders for an event
    getAllRidersForEvent(eventID){
        let allRidersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/rider')
            .then(response => {
                for(let i = 0; i < response.data.length; i++){
                    allRidersForEvent.push(new RiderElement(response.data[0].riderID, response.data[0].artistID,
                        response.data[0].eventID, response.data[0].status, response.data[0].isDone,
                        response.data[0].description))
                }
            })
            .catch(error => console.log(error));
        return allRidersForEvent;
    }

    //create a new rider element.
    createNewRiderElement(artistID, eventID, description){
        axios.post(axiosConfig.root + '/api/rider', {
            artistID: artistID,
            eventID: eventID,
            description: description
        })
            .catch(error => console.log(error));
    }

    //update a rider element
    updateRider(riderElementID, artistID, eventID, status, isDone, description){
        axios.put(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderElementID, {
            riderElementID: riderElementID,
            artistID: artistID,
            eventID: eventID,
            status: status,
            isDone: isDone,
            description: description
        })
            .catch(error => console.log(error));
    }

    //delete a rider element
    deleteRider(eventID, artistID, riderID){
        axios.delete(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderID)
            .catch(error => console.log(error));
    }

}

export let riderService = sharedComponentData(new riderService());


