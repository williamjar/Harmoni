import axios from 'axios';
const root = require('./axiosConfig');

export class RegisterOrganizerService{

    static registerOrganizer(email, password, successCallback, errorCallback){
        let header = {
            "Content-Type": "application/json"
        };

        let contactBody = {
            "contactName": null,
            "phone": null,
            "email": email
        };
        console.log("Inserting contact");
        axios.post(root + "/api/contact", JSON.stringify(contactBody), {headers: header}).then(res => {
            let contactID = res.data[0].insertId;
            console.log("Inserting organizer on contact with ID" + contactID);

            let organizerBody = {
                "username": null,
                "password": password,
                "contactID": contactID
            };

            axios.post("/api/organizer", JSON.stringify(organizerBody), {headers: header}).then(res => {
                console.log("Added organizer with organizerID " + res.data[0].insertId);
                //Used in tests for now, can also be used for other things.
                if (successCallback){
                    successCallback(res.data[0].insertId);
                }
            }).catch(err => {
                console.log(err);
                errorCallback();
            })
        }).catch(err => {
            console.log(err);
            errorCallback();
        });
    }

}