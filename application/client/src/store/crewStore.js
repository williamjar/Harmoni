import axios from "axios";
import {CrewMember} from "../classes/crewMember.js"
import {CookieStore} from "./cookieStore";
import createWithBsPrefix from "react-bootstrap/esm/createWithBsPrefix";
import {forEach} from "react-bootstrap/esm/ElementChildren";
import {CrewCategory} from "../classes/crewCategory";

let axiosConfig = require("./axiosConfig");

export class CrewStore {

    //static allCrewMembersByEvent = [];
    static allCrewMembersForOrganizer = [];
    static allCrewCategories = [];
    static allCrewCategoryEvent = [];
    allCrewForCurrentEvent = [];


    //get a crew member
    static getCrewMember(crewID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/' + crewID,  {headers: header}).then(response => {
            let crew =  new CrewMember(response.data[i].crewID, response.data[i].description,
                response.data[i].crewCategoryID, response.data[i].contactName, response.data[i].phone, response.data[i].email, response.data[i].isResponsible);
            callback(crew);
        });
    }


    //store and get all crew members for an organizer
    static storeAllCrewMembersForOrganizer(callback, organizerID){
        this.allCrewMembersForOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                this.allCrewMembersForOrganizer.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategoryID, response.data[i].contactName, response.data[i].phone, response.data[i].email, response.data[i].isResponsible));
            }
            callback();
        });
    }

    static storeAllCrewMembersForEvent(callback, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        this.allCrewForCurrentEvent = [];
        axios.get(axiosConfig.root + '/api/crew/event/' + eventID, {headers: header}).then(response => {
            console.log("response");
            console.log(response);
            for (let i = 0; i < response.data.length; i++) {
                this.allCrewForCurrentEvent.push(new CrewMember(response.data[i].crewID, response.data[i].description,
                    response.data[i].crewCategoryID, response.data[i].contactName, response.data[i].phone, response.data[i].email, response.data[i].isResponsible));
            }
            console.log("all crew for current event: " + this.allCrewForCurrentEvent);
            callback();
        });
    }

    // store/get all crew categories for an organizer
    static storeAllCrewCategoriesForOrganizer(callback, organizerID){
        let allCrewCategoriesByOrganizer = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/crew/categories/' +  organizerID, {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allCrewCategoriesByOrganizer.push(new CrewCategory (response.data[i].crewCategoryID, response.data[i].crewCategory));
            }
            console.log("all categories for organizer: " + allCrewCategoriesByOrganizer);
            callback();
        });
    }

    //register a new crew member and set as assigned for current event
    static createCrewMember(name, phone, email, description, crewCategoryID, eventID, organizerID){
        //TODO: Needs a Callback
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

            axios.post(axiosConfig.root + '/api/crew', crewBody, {headers: header}).then(response =>{
                    console.log(response);

                    //TODO: update this body, needs isResponsible, and crewCategory needs to exist
                    let assignBody = {
                        "eventID": eventID,
                        "crewCategoryID": crewCategoryID,
                        "crewID": response.data.insertId,
                        "isResponsible": false
                    };

                    axios.post(axiosConfig.root + '/api/crew/assign', assignBody,{headers: header}).then(response =>{
                    console.log(response);
                    //callback();
                    });
            });
        });
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