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
                return res.data.insertId;
            })
            .then(contactID => {
                let organizerBody = {
                    username: username,
                    password: password,
                    contactID: contactID
                };

                axios.get("http://localhost:8080/organizer/username/" + username).then(res => {
                    if (res.data.length === 0){
                        axios.get("http://localhost:8080/organizer/by-email/" + email).then(res => {
                            if (res.data.length === 0){
                                return axios.post('http://localhost:8080/organizer', JSON.stringify(organizerBody), header).then(res => {
                                    callback(200);
                                }).catch(() => callback(500));
                            }
                            callback(501);
                        }).catch(() => callback(500));
                    }
                    else{
                        callback(502);
                    }
                }).catch(() => callback(500));
            }).catch(() => callback(500));
    }

}