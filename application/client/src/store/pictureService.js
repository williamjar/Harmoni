import axios from "axios";
import {PictureElement} from "../classes/pictureElement";
import {OrganizerStore} from "./organizerStore";
import {CookieStore} from "./cookieStore";

const axiosConfig = require("./axiosConfig");

/**
 * @class PictureService
 * @classdesc Service class for functions related to accessing and modifying pictures.
 */
export class PictureService {

    /**
     * Returns a picture element in as Picture element class in callback.
     * @param {int} pictureID - The database ID of the organizer.
     * @param {function} callback
     */
    static getPicture(pictureID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/organizer/picture/' + pictureID, {headers: header})
            .then(response => {
                if (response.data[0].pictureID && response.data[0].pictureLink) {
                    callback(new PictureElement(response.data[0].pictureID, response.data[0].pictureLink));
                } else {
                    callback(null);
                }
            }).catch(err => callback(null));
    }

    /**
     * TODO unused
     */
    updatePicture(pictureID, pictureLink) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/insert/' + pictureID, {
            pictureLink: pictureLink
        }, {headers: header})
            .catch(error => console.log(error));
    }

    /**
     * TODO unused
     */
    static insertProfilePicture(organizerID, fileForm, callback) {
        for (let pair of fileForm.entries()) {
            console.log(pair);
        }

        let serverHeader = {
            "x-access-token": CookieStore.currentToken
        };

        axios.post('http://localhost:8080/api/file/profilePicture', fileForm, {headers: serverHeader})
            .then(response => {
                console.log(response.data);
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
                                if (response.status === 200) {
                                    callback(200, path);
                                }
                            });
                    });
            })
            .catch(err => callback(500));
    }

    /**
     *
     * @param {int} eventID -
     * @param {int} fileForm -
     * @param {function} callback -
     */
    static insertEventPicture(eventID, fileForm, callback) {
        let serverHeader = {
            "x-access-token": CookieStore.currentToken
        };
        axios.post('http://localhost:8080/api/file/eventPicture', fileForm, {headers: serverHeader}).then(response => {
            let databaseHeader = {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            };
            let body = {
                path: response.data.path
            };
            axios.post('http://localhost:8080/api/event/picture/', JSON.stringify(body), {headers: databaseHeader})
                .then(insertImageResponse => {
                    let databaseHeader = {
                        "Content-Type": "application/json",
                        "x-access-token": CookieStore.currentToken
                    };
                    axios.put('http://localhost:8080/api/event/picture/' + eventID, JSON.stringify({pictureID: insertImageResponse.data.insertId}), {headers: databaseHeader})
                        .then(updateImageResponse => {
                            if (updateImageResponse.status === 200 && updateImageResponse.data.affectedRows > 0) {
                                callback(200, response.data.path, insertImageResponse.data.insertId);
                            }
                        });
                })
        }).catch(err => {
            console.log(err);
            callback(500);
        });
    }


    static previewPicture(pictureLink, callback) {
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
            if ((/\.(jpg)$/i).test(pictureLink)) {
                blob = new Blob([response.data], {
                    type: "image/jpg"
                });
            } else if ((/\.(jpeg)$/i).test(pictureLink)) {
                blob = new Blob([response.data], {
                    type: "image/jpeg"
                });
            } else if ((/\.(png)$/i).test(pictureLink)) {
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
    deletePicture(pictureID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/organizer/picture/delete/' + pictureID, [], {headers: header})
            .catch(error => console.log(error));
    }

}