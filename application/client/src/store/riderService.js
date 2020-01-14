import axios from "axios";

const axiosConfig = require("./axiosConfig");
import RiderElement from "../classes/riderElement"
import {CookieStore} from "./cookieStore";


export class Rider {
    //get a rider element
    getRider(riderID) {

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        axios.get(axiosConfig.root + '/api/rider/' + riderID, headers)
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
        let allRiderElementsFromArtist = [];let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        axios.get(axiosConfig.root + '/api/artist/' + artistID + '/rider', headers).then(response => {
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
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        let allRiderElementsFromArtistAndEvent = [];
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider', headers)
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
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.get(axiosConfig.root + '/api/event/' + eventID + '/rider', headers)
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
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.post(axiosConfig.root + '/api/rider', {
            artistID: artistID,
            eventID: eventID,
            description: description
        }, headers)
            .catch(error => console.log(error));
    }

    //update a rider element
    updateRider(riderElementID, artistID, eventID, status, isDone, description){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.put(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderElementID, {
            riderElementID: riderElementID,
            artistID: artistID,
            eventID: eventID,
            status: status,
            isDone: isDone,
            description: description
        }, headers)
            .catch(error => console.log(error));
    }

    //delete a rider element
    deleteRider(eventID, artistID, riderID){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.delete(axiosConfig.root + '/api/event/' + eventID + '/artist/' + artistID + '/rider/' + riderID, headers)
            .catch(error => console.log(error));
    }

}

export let riderService = sharedComponentData(new riderService());


