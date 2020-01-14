import axios from "axios";

const axiosConfig = require("./axiosConfig");
import PictureElement from "../classes/pictureElement";

export class Picture {

    //Get picture
    getPicture(pictureID){
        axios.get(axiosConfig.root + '/api/picture/' + pictureID)
            .then(response => {
                return new PictureElement(response.data[0].pictureID, response.data[0].pictureLink);
            })
    }

    //Update picture
    updatePicture(pictureID, pictureLink){
        axios.post(axiosConfig.root + '/api/picture/insert/' + pictureID, {
            pictureLink: pictureLink
        })
            .catch(error => console.log(error));
    }

    //Insert picture
    insertPicture(pictureID, pictureLink){
        axios.post(axiosConfig.root + '/api/picture/insert/', {
            pictureLink: pictureLink
        })
            .catch(error => console.log(error));
    }


    //Delete picture
    deletePicture(pictureID){
        axios.post(axiosConfig.root + '/api/picture/delete/' + pictureID)
            .catch(error => console.log(error));
    }
}