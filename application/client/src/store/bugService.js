import axios from "axios";

class BugService{

    getOneBug(bugID, callback){
        return axios.get(`/api/bug/${bugID}`).then(() => callback());
    }

    getAllBugs(){
        return axios.get('/api/bug');
    }

    //Register bug
    registerBug(organizerID, description, date){
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            date: date,
            description: description
        })
            .catch(error => console.log(error))
    }

}

export let bugService = new BugService();


