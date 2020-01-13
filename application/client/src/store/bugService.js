import axios from "axios";
import {sharedComponentData} from "react-simplified";

class BugService{

    getOneBug(bugID){
        return axios.get(`/api/bug/${bugID}`);
    }

    getAllBugs(){
        return axios.get('/api/bug');
    }

}

export let bugService = sharedComponentData(new BugService());
