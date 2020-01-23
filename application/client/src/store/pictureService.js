import axios from "axios";
import {PictureElement} from "../classes/pictureElement";
import {EventStore} from "./eventStore";
import {OrganizerStore} from "./organizerStore";
import {CookieStore} from "./cookieStore";

const axiosConfig = require("./axiosConfig");

export class PictureService {

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
    static insertPicture(organizerID, fileForm, callback){
        for(let pair of fileForm.entries()){
            console.log(pair);
        }
        axios.post('http://localhost:8080/file/picture', fileForm)
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
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


    static previewPicture(pictureLink, callback){
            console.log("Link " + pictureLink);
            console.log("Kjører service");
            axios.get(axiosConfig.root + '/file/preview/' + pictureLink, {
                method: "GET",
                responseType: "blob"
                //Force to receive data in a Blob Format
            }).then(response => {
                //Create a Blob from the image Stream
                console.log(response.data);
                let blob;
                if((/\.(jpg)$/i).test(pictureLink)){
                    blob = new Blob([response.data], {
                        type: "image/jpg"
                    });
                }
                else if((/\.(jpeg)$/i).test(pictureLink)){
                    blob = new Blob([response.data], {
                        type: "image/jpeg"
                    });
                }
                else if((/\.(png)$/i).test(pictureLink)){
                    blob = new Blob([response.data], {
                        type: "image/png"
                    });
                } else {
                    blob = null
                }
                //Build a URL from the file
                console.log(blob);
                const fileURL = URL.createObjectURL(blob);
                console.log("HER KOMMER FIL URL " + fileURL);
                //Open the URL on new Window
                callback(fileURL);
            })
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