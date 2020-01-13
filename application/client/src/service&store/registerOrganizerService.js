import axios from 'axios';
const root = require('./axiosConfig').root;

export class RegisterOrganizerService{

    static registerOrganizer(username, email, password, callback){
        let header = {
            "Content-Type": "application/json"
        };

        let contactBody = {
            "username": username,
            "phone": null,
            "email": email
        };

        console.log("Creating contact at /contact");
        return axios.post('http://localhost:8080/contact', JSON.stringify(contactBody), {headers: header})
            .then(res => {
                console.log("Some text");
                console.log(res.status);
                console.log(res.data);
                return res.data.insertId;
            })
            .then(contactID => {
                console.log("Creating organizer with contactID" + contactID);
                callback(contactID);
            })
            .catch(error => console.log("Error: " + error));
    }

}