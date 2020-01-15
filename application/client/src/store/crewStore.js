import axios from "axios";
import {CrewMember} from "../classes/crewMember.js"
import {CookieStore} from "./cookieStore";

let axiosConfig = require("./axiosConfig");

export class CrewStore {
    allCrewMembersByEvent = [];
    allCrewMembersByOrganizer = [];

    //get a crew member
    static getCrewMember(crewID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/' + crewID,  {headers: header}).then(response => {
            let crew =  new CrewMember(response.data[0].contactName,
                response.data[0].phone, response.data[0].email, response.data[0].crewID, response.data[0].description);
            callback(crew);
        });
    }

    //get all crew members for an organizer
    static getAllCrewMembersForOrganizer(callback, organizerID) {
        let allCrewMembersByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersByOrganizer.push(new CrewMember(response.data[i].contactName, response.data[i].phone, response.data[i].email, response.data[i].crewID, response.data[i].description));
                this.addCategory(response.data[i].crewCategory);
            }
        });
        callback(allCrewMembersByOrganizer);
    }

    static storeAllCrewMembersForOrganizer(organizerID){
        this.allCrewMembersByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                this.allCrewMembersByOrganizer.push(new CrewMember(response.data[i].contactName, response.data[i].phone, response.data[i].email, response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory));
            }
        });
    }

    // get all crew categories for an organizer
    static getAllCrewCategoriesForOrganizer(callback, organizerID){
        let allCrewCategoriesByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID, {headers: header}).then(response =>  {
            let categories = new CrewMember;
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(categories.addCrewCategory(response.data[i].crewCategory));
            }
        });
        return callback(allCrewCategoriesByOrganizer);
    }

    //get all crew members for an event
    static getAllCrewMembersForEvent(callback, eventID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        let allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewMembersForEvent.push(new CrewMember(response.data[i].contactName,
                    response.data[i].phone, response.data[i].email, response.data[i].crewID, response.data[i].description));
            }
            axios.get(axiosConfig.root + 'api/crew/event/' + eventID + '/categories/' + response.data[i].crewID, {headers: header}).then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    this.addCategory(response.response.data[i].crewCategory);
                }
            });
        });
        callback(allCrewMembersForEvent);
    }

    static storeAllCrewMembersForEvent(eventID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        this.allCrewMembersForEvent = [];
        axios.get(axiosConfig.root + '/api/event/crew/' + eventID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                this.allCrewMembersForEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategory, response.data[i].contactName, response.data[i].phone, response.data[i].email));
            }
        });
    }

    //register a new crew member
    static createCrewMember(name, phone, email, description, organizerID){
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
            //callback();
        })
    }

    //add a new category
    static addCategory(callback ,categoryName, organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        },  {headers: header}).then(response => callback(response.json().status));
    }

    //assign a crew member to an event
    static assignCrewMemberToEvent(callback, eventID, categoryID, crewID, isResponsible){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible
        },  {headers: header}).then(response => callback(response.json().status));
    }

    //add a document to a crew member
    static addDocumentToCrewMember(callback, eventID, name, link, crewID, categoryID){
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
        },  {headers: header}).then(response => callback(response.json().status));
    }

    //update a crew member
    static updateCrewMember(callback, description, id) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/crew/' + id, {
            "description": description,
            "crewID": id
        },  {headers: header}).then(response => callback(response.json().status));
    }

    //update crew member as leader in a category for an event.
    //it is possible for a crew member to be a leader for more than one category
    static updateCrewMemberAsLeader(callback, isResponsible, eventID, categoryID, crewID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/responsible/' + isResponsible, {
            "isResponsible": isResponsible,
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID
        },  {headers: header}).then(response => callback(response.json().status));
    }

    //delete crew member
    static deleteCrewMember(callback, crewID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/' + crewID,  {headers: header})
            .then(response => callback(response.json().status));
    }

    //delete crew category
    static deleteCrewCategory(callback, crewCategoryID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID,  {headers: header})
            .then(response => callback(response.json().status));
    }

    //remove crew member from event
    static unassignCrewMemberFromEvent(callback, eventID, crewCategoryID, crewID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID,  {headers: header})
            .then(response => callback(response.json().status));
    }

    //delete crew member
    static unassignCrewMember(crewCategoryID, crewID){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/crew/assign/' + crewID + '/' + crewCategoryID + '/' + crewID, {headers: header}).then(response => console.log(response));
    }

}