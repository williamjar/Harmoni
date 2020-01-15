import axios from "axios";

const axiosConfig = require("./axiosConfig");
import PictureElement from "../classes/pictureElement";
import {CookieStore} from "./cookieStore";
import {EventStore} from "./eventStore";
import {OrganizerStore} from "./organizerStore";

export class Picture {

    //Get picture
    getPicture(pictureID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/organizer/picture/' + pictureID, {headers: header})
            .then(response => {
                return new PictureElement(response.data[0].pictureID, response.data[0].pictureLink);
            })
    }

    //Update picture
    updatePicture(pictureID, pictureLink){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/insert/' + pictureID, {
            pictureLink: pictureLink
        }, {headers: header})
            .catch(error => console.log(error));
    }

    //Insert picture
    insertPicture(organizerID, pictureLink, file, callback){
        axios.post('http://localhost:8080/api/file/picture', file)
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                const path = response.data.path;
                const name = OrganizerStore.currentOrganizer.contactName;
                const filename = response.data.name;

                let body = {
                    path: path
                };
                axios.post('http://localhost:8080/api/organizer/picture', JSON.stringify(body), {headers: databaseHeader})
                    .then(response => {
                        console.log("Response.data: ");
                        console.log(response.data);
                        let organizerPictureBody = {
                            pictureID: response.data.insertId
                        };

                        axios.put('http://localhost:8080/api/organizer/picture/' + OrganizerStore.currentOrganizer.organizerID, JSON.stringify(organizerPictureBody), {headers: databaseHeader})
                            .then(response => {
                                if (response.status === 200){
                                    callback(200);
                                }
                            });
                    });
            })
            .catch(err => callback(500));
    }


    //Delete picture
    deletePicture(pictureID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/delete/' + pictureID, [], {headers: header})
            .catch(error => console.log(error));
    }

}