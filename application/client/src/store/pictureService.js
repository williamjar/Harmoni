import axios from "axios";

const axiosConfig = require("./axiosConfig");
import PictureElement from "../classes/pictureElement";
import {CookieStore} from "./cookieStore";

export class Picture {

    //Get picture
    getPicture(pictureID){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.get(axiosConfig.root + '/api/picture/' + pictureID, headers)
            .then(response => {
                return new PictureElement(response.data[0].pictureID, response.data[0].pictureLink);
            })
    }

    //Update picture
    updatePicture(pictureID, pictureLink){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.post(axiosConfig.root + '/api/picture/insert/' + pictureID, {
            pictureLink: pictureLink
        }, headers)
            .catch(error => console.log(error));
    }

    //Insert picture
    insertPicture(pictureID, pictureLink){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.post(axiosConfig.root + '/api/picture/insert/', {
            pictureLink: pictureLink
        }, headers)
            .catch(error => console.log(error));
    }


    //Delete picture
    deletePicture(pictureID){
        axios.post(axiosConfig.root + '/api/picture/delete/' + pictureID)
            .catch(error => console.log(error));
    }
}