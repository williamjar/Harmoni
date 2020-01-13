import axios from "axios";
import {sharedComponentData} from "react-simplified";
import CrewMember from ".classes/crewMember.js"
import CrewLeader from ".classes/crewLeader.js"

let axiosConfig = require("./axiosConfig");

class CrewService {

    static getCrewMember(crewID){
        axios.get(axiosConfig.root + '/api/crew/' + crewID).then(response => {
            return new CrewMember(response.data[0].description, response.data[0].contactName,
                response.data[0].phone, response.data[0].email);
        });
    }

    static getAllCrewMembersForOrganizer(organizerID) {
        let allCrewMembersByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersByOrganizer.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersByOrganizer;
    }

    static getAllCrewCategoriesForOrganizer(organizerID){
        let allCrewCategoriesByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(new CrewMember(response.data[i].crewCategory));
            }
        });
        return allCrewCategoriesByOrganizer;
    }

    static getAllCrewMembersForEvent(eventID){
        let allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersForEvent;
    }

    static createCrewMember(name, phone, email, description, organizerID){
        let header = {
            "Content-Type": "application/json"
        };

        let contactBody = {
            "contactName": name,
            "phone": phone,
            "email": email
        };

        let contactID = 0;

        axios.post(axiosConfig.root + '/api/contact', JSON.stringify(contactBody), {headers: header}).then(response => {
                contactID = response.insertId;
            }
        );

        let crewBody = {
            "description": description,
            "organizerID": organizerID,
            "contactID": contactID
        };

        axios.post('/api/crew', JSON.stringify(crewBody), {headers: header}).then(response =>
            console.log(response));
    }

    static addCategory(categoryName, organizerID){
        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        }).then(response => response.data);
    }

    static assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible){
        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        }).then(response => response.data);
    }

    static addDocumentToCrewMember(eventID, name, link, crewID, categoryID){
        return axios.post(axiosConfig.root + '/api/document/crew',{
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }).then(response => response.data);
    }

    static updateCrewMember(description, id) {
        return axios.put(axiosConfig.root + '/api/crew/' + id, {
            "description": description,
            "crewID": id
        }).then(response => response.data);
    }

    static updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID) {
        return axios.put(axiosConfig.root + '/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        }).then(response => response.data);
    }

    static deleteCrewMember(crewID) {
        return axios.delete(axiosConfig.root + '/api/crew/' + crewID).then(response => console.log(response));
    }

    static deleteCrewCategory(crewCategoryID) {
        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID).then(response => console.log(response));
    }

    static unassignCrewMember(crewCategoryID, crewID){
        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID).then(response => console.log(response));
    }

}