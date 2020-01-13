import axios from "axios";

class BugService{

    getOneBug(bugID, callback){
        return axios.get(`/api/bug/${bugID}`).then(() => callback());
    }

    getAllBugs(){
        return axios.get('/api/bug');
    }

}

export let bugService = new BugService();


