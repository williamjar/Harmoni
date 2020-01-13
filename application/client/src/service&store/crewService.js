import axios from "axios";
import {sharedComponentData} from "react-simplified";
import CrewMember from ".classes/crewMember.js"
import CrewLeader from ".classes/crewLeader.js"

let axiosConfig = require("./axiosConfig");

class CrewService {

    getCrewMember(crewID){
        axios.get(axiosConfig.root + '/api/crew/' + crewID).then(response =>
        {
            return new CrewMember(response.data[0].crewID, response.data[0].description,
                response.data[0].crewCategory, response.data[0].contactID,
                response.data[0].contactName, response.data[0].phone, response.data[0].email);
        });
    }

    getAllCrewMembersForOrganizer(organizerID) {
        let allCrewMembersByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersByOrganizer.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactID,
                    response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersByOrganizer;
    }

    getAllCrewCategoriesForOrganizer(organizerID){
        let allCrewCategoriesByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(new CrewMember(response.data[i].crewCategoryID,
                    response.data[i].crewCategory));
            }
        });
        return allCrewCategoriesByOrganizer;
    }

    getAllCrewMembersForEvent(eventID){
        let allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactID,
                    response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersForEvent;
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
        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        }).then(response => response.data);
    }

    assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible){
        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        }).then(response => response.data);
    }

    addDocumentToCrewMember(eventID, name, link, crewID, categoryID){
        return axios.post(axiosConfig.root + '/api/document/crew',{
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }).then(response => response.data);
    }

    updateCrewMember(description, id) {
        return axios.put(axiosConfig.root + '/api/crew/' + id, {
            "description": description,
            "crewID": id
        }).then(response => response.data);
    }

    updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID) {
        return axios.put(axiosConfig.root + '/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        }).then(response => response.data);
    }

    deleteCrewMember(crewID) {
        return axios.delete(axiosConfig.root + '/api/crew/' + crewID).then(response => response.data);
    }

    deleteCrewMember(crewCategoryID) {
        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID).then(response => response.data);
    }

    unassignCrewMember(crewCategoryID, crewID){
        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID).then(response => response.data);
    }

}