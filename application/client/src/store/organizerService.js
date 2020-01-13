import axios from "axios";
import {sharedComponentData} from "react-simplified";


class OrganizerService {

    getOrganizer(organizerId){
        return axios.get(`/api/organizer/${organizerId}`)
    }

    changeUserName(){

    }

    changePassword(organizerID, oldPassword,  newPassword){
        //TODO: Add check for old password to see if password change is allowed

        let json = {
            'password' : newPassword
        };
        return axios.put(`/api/organizer/${organizerID}`, json);
    }

    changePhoneNumber(){

    }

    changeUserImage(){

    }


    getAllEvents(organizerId){
        return axios.get(`/api/organizer/${organizerId}/events`);
    }


}

export let organizerService = sharedComponentData(new organizerService());
