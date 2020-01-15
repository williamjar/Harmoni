import axios from "axios";
import {CrewMember} from "../classes/crewMember.js"
import {CrewLeader} from "../classes/crewLeader.js"
import {CookieStore} from "./cookieStore";

let axiosConfig = require("./axiosConfig");

export class CrewService {

    static getCrewMember(crewID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/' + crewID, {headers: header}).then(response => {
            return new CrewMember(response.data[0].description, response.data[0].contactName,
                response.data[0].phone, response.data[0].email);
        });
    }

    static getAllCrewMembersForOrganizer(organizerID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let allCrewMembersByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersByOrganizer.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersByOrganizer;
    }

    static getAllCrewCategoriesForOrganizer(organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let allCrewCategoriesByOrganizer = [];
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(new CrewMember(response.data[i].crewCategory));
            }
        });
        return allCrewCategoriesByOrganizer;
    }

    static getAllCrewMembersForEvent(eventID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let allCrewMembersForEventAndCategory = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEventAndCategory.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersForEventAndCategory;
    }

    static getAllCrewMembersForEventAndCategory(eventID,crewCategoryID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
        return allCrewMembersForEvent;
    }


    static createCrewMember(name, phone, email, description, organizerID, callback){

        console.log("Inside createCrewMember");
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let contactBody = {
            "username": name,
            "phone": phone,
            "email": email
        };



        axios.post(axiosConfig.root + '/api/contact', contactBody, {headers: header}).then(response => {
            console.log("Axios post then");
            let crewBody = {
                "description": description,
                "organizerID": organizerID,
                "contactID": response.data.insertId
            };

            axios.post(axiosConfig.root + '/api/crew', crewBody, {headers: header}).then(response =>
                console.log(response));
                callback();

        })


    }




    static addCategory(categoryName, organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        }, {headers: header}).then(response => response.data);
    }

    static assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        }, {headers: header}).then(response => response.data);
    }

    static addDocumentToCrewMember(eventID, name, link, crewID, categoryID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.post(axiosConfig.root + '/api/document/crew',{
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }, {headers:header}).then(response => response.data);
    }

    static updateCrewMember(description, id) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/crew/' + id, {
            "description": description,
            "crewID": id
        }, {headers: header}).then(response => response.data);
    }

    static updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        }, {headers: header}).then(response => response.data);
    }

    static deleteCrewMember(crewID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/crew/' + crewID, {headers: header}).then(response => console.log(response));
    }

    static deleteCrewCategory(crewCategoryID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID, {headers: header}).then(response => console.log(response));
    }

    static unassignCrewMember(crewCategoryID, crewID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/crew/assign/' + crewID + '/' + crewCategoryID + '/' + crewID, {headers: header}).then(response => console.log(response));
    }

}