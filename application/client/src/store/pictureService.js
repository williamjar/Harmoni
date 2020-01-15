import axios from "axios";

const axiosConfig = require("./axiosConfig");
import PictureElement from "../classes/pictureElement";
import {CookieStore} from "./cookieStore";

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
    insertPicture(organizerID, pictureLink){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/organizer/picture/" + organizerID, {headers: header}).then(response => {
           if (response.status === 500 || response.data.length === 0){
               //Picture doesn't exist -> Create
               let body = {
                    pictureLink: pictureLink
               };
               axios.post(axiosConfig.root + "/api/organizer/picture/" + organizerID)
           }
           else{
               //Picture does exist -> Update
               let updateBody = {
                   pictureLink: pictureLink
               };
               axios.put("/api/organizer/picture/" + response.data.pictureID, JSON.stringify(updateBody), {headers: header}).then(response => {
                   console.log("Picture link updated in DB");
               });
           }
        });

        axios.post(axiosConfig.root + '/api/organizer/picture/upload/' + organizerID, {

        }, {headers: header})
            .catch(error => console.log(error));
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