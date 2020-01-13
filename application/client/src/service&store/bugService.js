import axios from "axios";

const axiosConfig = require("./axiosConfig");

export class Bug {

    //Register bug
    registerBug(organizerID, description, date){
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            date: date,
            description: description
        })
            .catch(error => console.log(error))
    }
}