import axios from "axios";
import {CookieStore} from "./cookieStore";

class BugService{

    getOneBug(bugID, callback){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        return axios.get(`/api/bug/${bugID}`, headers).then(() => callback());
    }

    getAllBugs(){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        return axios.get('/api/bug', headers);
    }

    //Register bug
    registerBug(organizerID, description, date){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            date: date,
            description: description
        }, headers)
            .catch(error => console.log(error))
    }

}

export let bugService = new BugService();


