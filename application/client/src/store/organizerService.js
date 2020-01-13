import axios from "axios";
import {Organizer} from "../classes/organizer.js"

const axiosConfig = require("./axiosConfig");

export class OrganizerService {

    static getOrganizer(organizerID) {
        axios.get(axiosConfig.root + '/api/organizer/' + organizerID).then(response => {
                let organizer = new Organizer(response.data[0].organizerID, response.data[0].contactName, response.data[0].phone,
                    response.data[0].email, response.data[0].username, response.data[0].pictureLink);
                //callback(organizer);
                return organizer;
            }
        );
    }

    // organizerID, name, phone, email, username, pictureLink


    changeUserName() {

    }

    changePassword(organizerID, oldPassword, newPassword) {
        //TODO: Add check for old password to see if password change is allowed

        let json = {
            'password': newPassword
        };
        return axios.put(`/api/organizer/${organizerID}`, json);
    }

    changePhoneNumber() {

    }

    changeUserImage() {

    }


    getAllEvents(organizerId) {
        return axios.get(`/api/organizer/${organizerId}/events`);
    }


}
