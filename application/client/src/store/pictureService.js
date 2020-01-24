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
     * Inserts a picture into the database and assigns it to a user.
     * @param {int} organizerID - Database ID of the organizer.
     * @param TODO what type is this? {} fileForm - Description.
     * @param {function} callback
     */
    static insertProfilePicture(organizerID, fileForm, callback) {

        let serverHeader = {
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/file/profilePicture', fileForm, {headers: serverHeader})
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                const path = response.data.path;

                let body = {
                    path: path
                };
                axios.post(axiosConfig.root + '/api/organizer/picture', JSON.stringify(body), {headers: databaseHeader})
                    .then(response => {
                        let organizerPictureBody = {
                            pictureID: response.data.insertId
                        };

                        axios.put(axiosConfig.root + '/api/organizer/picture/' + OrganizerStore.currentOrganizer.organizerID, JSON.stringify(organizerPictureBody), {headers: databaseHeader})
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
     * Inserts a picture into the database and assigns it to an event.
     * @param {int} eventID - The database ID of the event.
     * @param TODO what type is this? {} fileForm - Description.
     * @param {function} callback
     */
    static insertEventPicture(eventID, fileForm, callback) {
        let serverHeader = {
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/file/eventPicture', fileForm, {headers: serverHeader}).then(response => {
            let databaseHeader = {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            };
            let body = {
                path: response.data.path
            };
            axios.post(axiosConfig.root + '/api/event/picture/', JSON.stringify(body), {headers: databaseHeader})
                .then(insertImageResponse => {
                    let databaseHeader = {
                        "Content-Type": "application/json",
                        "x-access-token": CookieStore.currentToken
                    };
                    axios.put(axiosConfig.root + '/api/event/picture/' + eventID, JSON.stringify({pictureID: insertImageResponse.data.insertId}), {headers: databaseHeader})
                        .then(updateImageResponse => {
                            if (updateImageResponse.status === 200 && updateImageResponse.data.affectedRows > 0) {
                                callback(200, response.data.path, insertImageResponse.data.insertId);
                            }
                        });
                })
        }).catch(err => {
            callback(500);
        });
    }

    /**
     * Returns the URL of a file to preview in the callback.
     * @param {string} pictureLink - The database ID of the event.
     * @param {function} callback
     */
    static previewPicture(pictureLink, callback){
            axios.get(axiosConfig.root + '/file/preview/' + pictureLink, {
                method: "GET",
                responseType: "blob"
                //Force to receive data in a Blob Format
            }).then(response => {
                //Create a Blob from the image Stream
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
                const fileURL = URL.createObjectURL(blob);
                //Open the URL on new Window
                callback(fileURL);
            })
    }
}