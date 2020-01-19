import axios from "axios";
import {PictureElement} from "../classes/pictureElement";
import {EventStore} from "./eventStore";
import {OrganizerStore} from "./organizerStore";
import {CookieStorage} from "../cookieStorage";

const axiosConfig = require("./axiosConfig");

export class PictureService {

    //Get picture
    getPicture(pictureID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStorage.currentToken
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
            "x-access-token": CookieStorage.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/insert/' + pictureID, {
            pictureLink: pictureLink
        }, {headers: header})
            .catch(error => console.log(error));
    }

    //Insert picture
    static insertPicture(organizerID, fileForm, callback){
        console.log("File form: ");
        console.log(fileForm);
        for(let pair of fileForm.entries()){
            console.log(pair);
        }
        axios.post('http://localhost:8080/api/file/picture', fileForm)
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStorage.currentToken
                };

                const path = response.data.path;

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
                                    callback(200, path);
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
            "x-access-token": CookieStorage.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/delete/' + pictureID, [], {headers: header})
            .catch(error => console.log(error));
    }

}