import axios from "axios";
import Event from "../classes/event.js";
import {CookieStore} from "../cookies_client/cookieStore.js";

let axiosConfig = require("./axiosConfig");

class eventStore{

    static currentEvent = new Event(-1, "", "", "", "", "", "", "", -1, "", "",
        "", "", -1, -1);

    static allEvents = [];

    static getEvent(eventID){

        let header = {
            "Content-Type": "application/json"
        };

        let body = {
            "email": email,
            "password": hashedSaltedPassword
        };

        return axios.post("http://localhost/login", JSON.stringify(body), {headers: header}).then(res => res.json())
            .then(loginResponse => {
                console.log(loginResponse);
                axios.get("http://localhost:8080/organizer/by-email/" + email).then(res => res.json)
                    .then(emailResponse => {
                        if (!(loginResponse.error)){
                            localStorage.setItem('organizerID', emailResponse.organizerID);
                            localStorage.setItem('access-token', loginResponse.jwt);
                        }
                        else{
                            localStorage.setItem('organizerID', null);
                            localStorage.setItem('access-token', null);
                        }
                    });
            });
    }

    static getAllEvents(){

        return axios.get(axiosConfig.root + "/api/events")
    }
}
