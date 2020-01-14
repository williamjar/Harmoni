import axios from "axios";
import {CookieStore} from "./cookieStore";

class BugService{

    getOneBug(bugID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get(`/api/bug/${bugID}`, {headers: header}).then(() => callback());
    }

    getAllBugs(){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get('/api/bug', {headers: header});
    }

    //Register bug
    registerBug(organizerID, description, date){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            date: date,
            description: description
        }, {headers: header})
            .catch(error => console.log(error))
    }

}

export let bugService = new BugService();


