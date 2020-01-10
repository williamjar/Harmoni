import axios from "axios";
import {sharedComponentData} from "react-simplified";
import CrewMember from ".classes/crewMember.js"
import CrewLeader from ".classes/crewLeader.js"

let axiosConfig = require("./axiosConfig");

class CrewService {

    getCrewMember(crewID){
        return axios.get<CrewMember>('/api/crew/' + crewID).then(response => response.data);
    }

    getAllCrewMembersForOrganizer(organizerID) {
        return axios.get('/api/crew/organizer/' + organizerID).then(response => response.data);
    }

    getAllCrewCategoriesForOrganizer(organizerID){
        return axios.get('/api/crew/categories/' +  organizerID).then(response => response.data);
    }

    getAllCrewMembersForEvent(eventID){
        return axios.get('/api/event/crew/' + eventID).then(response => response.data);
    }

    addCrewMember(){
        return axios.post('/api/crew', crew).then(response => response.data);
    }

    addCategory(){
        return axios.post('/api/crew-category', crew).then(response => response.data);
    }

    assignCrewMemberToEvent(){
        return axios.post('/api/crew/assign', crew).then(response => response.data);
    }

    addDocumentToCrewMember(){
        return axios.post('/api/document/crew', crewinfo).then(response => response.data);
    }

    updateCrewMember(crewinfo) {
        return axios.put('/api/crew/' + id, crewinfo).then(response => response.data);
    }

    updateCrewMemberAsLeader(crew) {
        return axios.put('/api/responsible/' + isResponsible, crew).then(response => response.data);
    }

    deleteCrewMember(crewID) {
        return axios.delete<CrewMember>('/api/crew/' + crewID).then(response => response.data);
    }

    deleteCrewMember(crewCategoryID) {
        return axios.delete<CrewMember>('/api/crew-category/' + crewCategoryID).then(response => response.data);
    }

    unassignCrewMember(){
        return axios.delete<CrewMember>('/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID).then(response => response.data);
    }

}