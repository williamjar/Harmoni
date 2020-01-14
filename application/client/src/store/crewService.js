import axios from "axios";
import {sharedComponentData} from "react-simplified";
import CrewMember from ".classes/crewMember.js"
import CrewLeader from ".classes/crewLeader.js"
import {CookieStore} from "./cookieStore";

let axiosConfig = require("./axiosConfig");

class CrewService {

    static getCrewMember(crewID){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        axios.get(axiosConfig.root + '/api/crew/' + crewID, headers).then(response => {
            return new CrewMember(response.data[0].description, response.data[0].contactName,
                response.data[0].phone, response.data[0].email);
        });
    }

    static getAllCrewMembersForOrganizer(organizerID) {

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        let allCrewMembersByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, headers).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersByOrganizer.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersByOrganizer;
    }

    static getAllCrewCategoriesForOrganizer(organizerID){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        let allCrewCategoriesByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID, headers).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(new CrewMember(response.data[i].crewCategory));
            }
        });
        return allCrewCategoriesByOrganizer;
    }

    static getAllCrewMembersForEvent(eventID){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        let allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID, headers).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersForEvent;
    }

    static createCrewMember(name, phone, email, description, organizerID){
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

    static addCategory(categoryName, organizerID){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        }, headers).then(response => response.data);
    }

    static assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        }, headers).then(response => response.data);
    }

    static addDocumentToCrewMember(eventID, name, link, crewID, categoryID){

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        return axios.post(axiosConfig.root + '/api/document/crew',{
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }, headers).then(response => response.data);
    }

    static updateCrewMember(description, id) {

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        return axios.put(axiosConfig.root + '/api/crew/' + id, {
            "description": description,
            "crewID": id
        }, headers).then(response => response.data);
    }

    static updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID) {

        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };

        return axios.put(axiosConfig.root + '/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        }, headers).then(response => response.data);
    }

    static deleteCrewMember(crewID) {
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        return axios.delete(axiosConfig.root + '/api/crew/' + crewID, headers).then(response => console.log(response));
    }

    static deleteCrewCategory(crewCategoryID) {
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID, headers).then(response => console.log(response));
    }

    static unassignCrewMember(crewCategoryID, crewID){
        let headers = {
            header: {
                "Content-Type": "application/json",
                "x-access-token": CookieStore.currentToken
            }
        };
        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID, headers).then(response => console.log(response));
    }

}