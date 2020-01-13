import axios from "axios";
import {sharedComponentData} from "react-simplified";
import CrewMember from ".classes/crewMember.js"
import CrewLeader from ".classes/crewLeader.js"

let axiosConfig = require("./axiosConfig");

class CrewService {

    getCrewMember(crewID){
        return axios.get('/api/crew/' + crewID).then(response => response.data);
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

    addCrewMember(name, phone, email, description, organizerID){
       /* axios.post('/api/contact', {
            "contactName": name,
            "phone": phone,
            "email": email
        }).then((response => response.data),

       axios.post('/api/crew', {
            "description": description,
            "organizerID": organizerID,
            "contactID": contactID
        }).then(response => response.data); */
    }

    addCategory(categoryName, organizerID){
        axios.post('/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        }).then(response => response.data);
    }

    assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible){
        axios.post('/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        }).then(response => response.data);
    }

    addDocumentToCrewMember(eventID, name, link, crewID, categoryID){
        return axios.post('/api/document/crew',{
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }).then(response => response.data);
    }

    updateCrewMember(description, id) {
        return axios.put('/api/crew/' + id, {
            "description": description,
            "crewID": id
        }).then(response => response.data);
    }

    updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID) {
        return axios.put('/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        }).then(response => response.data);
    }

    deleteCrewMember(crewID) {
        return axios.delete('/api/crew/' + crewID).then(response => response.data);
    }

    deleteCrewMember(crewCategoryID) {
        return axios.delete('/api/crew-category/' + crewCategoryID).then(response => response.data);
    }

    unassignCrewMember(crewCategoryID, crewID){
        return axios.delete('/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID).then(response => response.data);
    }

}