import axios from "axios";
import {CrewMember} from "../classes/crewMember.js"
import {CookieStore} from "./cookieStore";
import {CrewCategory} from "../classes/crewCategory";

let axiosConfig = require("./axiosConfig");

/**
 * @class CrewStore
 * @classdesc Store Class for functions related to accessing and modifying crew objects.
 */
export class CrewStore {

    /*
    Create set functions if set outside of here
     */
    static allCrewMembersForOrganizer = [];
    static allCrewCategoriesForOrganizer = [];
    static allCrewCategoriesForCurrentEvent = [];
    static allCrewForCurrentEvent = [];

    /**
     * Returns a Crew Object with data from the database and returns it in the callback
     * @param {int} crewID - The database ID of the crew member.
     * @param {function} callback
     */
    static getCrewMember(crewID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/' + crewID, {headers: header}).then(response => {
            let crew = new CrewMember(response.data[0].crewID, response.data[0].contactID, response.data[0].description,
                response.data[0].crewCategoryID, response.data[0].contactName, response.data[0].phone, response.data[0].email, response.data[0].isResponsible);
            callback(crew);
        });
    }


    /**
     * Returns a Crew Object with data from the database and returns it in the callback
     * @param {function} callback
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static storeAllCrewMembersForOrganizer(callback, organizerID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/organizer/' + organizerID, {headers: header}).then(response => {
            this.allCrewMembersForOrganizer = [];

            response.data.map(data => {
                this.allCrewMembersForOrganizer.push(new CrewMember(data.crewID, data.contactID, data.description, data.crewCategoryID,
                    data.crewCategoryName, data.contactName, data.phone, data.email));
                return 0;
            });

            callback();
        });
    }

    /**
     * Sets the variable allCrewForCurrentEvent as a list of Crew objects created with data from the database
     * @param {function} callback
     * @param {int} eventID - The database ID of the event.
     */
    static storeAllCrewMembersForEvent(callback, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/event/' + eventID, {headers: header}).then(response => {
            this.allCrewForCurrentEvent = [];

            response.data.map(data => {
                this.allCrewForCurrentEvent.push(new CrewMember(data.crewID, data.contactID, data.description, data.crewCategoryID,
                    data.crewCategoryName, data.contactName, data.phone, data.email, (data.isResponsible === 1), (data.contractSigned === 1), (data.hasBeenPaid === 1)));
                return 0;
            });
            callback();
        });
    }

    /**
     * Sets the variable allCrewCategoriesForOrganizer as a list of CrewCategory objects created with data from the database
     * @param {function} callback
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static storeAllCrewCategoriesForOrganizer(callback, organizerID) {



        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/categories/' + organizerID, {headers: header}).then(response => {
            this.allCrewCategoriesForOrganizer = [];

            response.data.map(data => {
                this.allCrewCategoriesForOrganizer.push(new CrewCategory (data.crewCategoryID, data.crewCategoryName));
                return 0;
            });
            callback();
        });
    }

    /**
     * Sets the variable allCrewCategoriesForEvent as a list of CrewCategory objects created with data from the database
     * @param {function} callback
     * @param {int} eventID - The database ID of the event.
     */
    static storeAllCrewCategoriesForEvent(callback, eventID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + '/api/crew/event/' + eventID + '/categories', {headers: header}).then(response =>  {
            this.allCrewCategoriesForCurrentEvent = [];

            response.data.map(data => {
                this.allCrewCategoriesForCurrentEvent.push(new CrewCategory (data.crewCategoryID, data.crewCategoryName));
                return 0;
            });

            callback();
        });
    }

    /**
     * Creates a new crew member and assigns it to the current event. The crew member is then stores in the database
     * @param {function} callback
     * @param {String} name - The name of the new crew member.
     * @param {String} phone - The phone of the new crew member.
     * @param {String} email - The email of the new crew member.
     * @param {String} description - A description the new crew member.
     * @param {int} crewCategoryID - The database ID of the Crew category the new crew member will be added to.
     * @param {int} isResponsible - A boolean
     * @param {int} eventID - The database ID of the event.
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static createCrewMemberForEvent(callback, name, phone, email, description, crewCategoryID, isResponsible, eventID, organizerID){
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

                    let assignBody = {
                        "eventID": eventID,
                        "crewCategoryID": crewCategoryID,
                        "crewID": response.data.insertId,
                        "isResponsible": isResponsible,
                        "contractSigned": 0,
                        "hasBeenPaid": 0
                    };

                axios.post(axiosConfig.root + '/api/crew/assign', assignBody,{headers: header}).then(response =>{
                    callback();
                    });
            });
        });
    }

    //create new crew member (for use in "Personell"-overview and not in edit event).
    //This crew member will not be assigned to an event
    /**
     * Creates a new crew member without assigning them to an event. The crew member is then stored in the database.
     * @param {String} name - The name of the new crew member.
     * @param {String} phone - The phone of the new crew member.
     * @param {String} email - The email of the new crew member.
     * @param {String} description - A description the new crew member.
     * @param {int} crewCategoryID - The database ID of the Crew category the new crew member will be added to.
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static createCrewMember(name, phone, email, description, organizerID, callback) {
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

            axios.post(axiosConfig.root + '/api/crew', crewBody, {headers: header}).then(response => {
                console.log(response);
                callback();
            });
        });
    }

    /**
     * Creates a new crew category for that organizer and saves it to the database.
     * @param {String} categoryName - The name of the new crew category.
     * @param {int} organizerID - The database ID of the logged in organizer.
     */
    static addCategory(categoryName, organizerID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew-category', {
            "crewCategoryName": categoryName,
            "organizerID": organizerID
        },  {headers: header}).then(response => console.log(response));
    }

    /**
     * Assigns an existing crew member to a crew category in an event and saves it to the database.
     * @param {int} eventID - The database ID of the event.
     * @param {int} categoryID - The database ID of crew category the crew member will be assigned to.
     * @param {int} crewID - The database ID of the crew member.
     * @param {int} isResponsible - (True/False) Whether the crew member is set to be the responsible for that category.
     * @param {int} contractSigned - (True/False) Whether the crew member has signed a contract or not.
     * @param {int} hasBeenPaid - (True/False) Whether the crew member has been payed or not.
     * @param {function} callback
     */
    static assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible, contractSigned, hasBeenPaid, callback){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/crew/assign', {
            "eventID": eventID,
            "crewCategoryID": categoryID,
            "crewID": crewID,
            "isResponsible": isResponsible,
            "contractSigned": contractSigned,
            "hasBeenPaid": hasBeenPaid
        },  {headers: header}).then(response => callback(response.data));
    }

    /**
     * TODO - Currently unused - Update or delete?
     */
    static addDocumentToCrewMember(eventID, name, link, crewID, categoryID){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.post(axiosConfig.root + '/api/document/crew', {
            "eventID": eventID,
            "documentName": name,
            "documentLink": link,
            "crewID": crewID,
            "documentCategoryID": categoryID
        },  {headers: header}).then(response => console.log(response));
    }

    /**
     * Updates the the description for an existing crew member and saves it to the database.
     * @param {String} description - The database ID of the event.
     * @param {crewID} crewID - The database ID of the crew member.
     */
    static updateCrewMember(description, crewID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/crew/' + crewID, {
            "description": description,
            "crewID": crewID
        },  {headers: header}).then(response => console.log(response));
    }

    /**
     * Update crew member as responsible in a category for an event.
     * @param {int} isResponsible - (True/False) Whether the crew member is set to be the responsible for that category.
     * @param {int} contractSigned - (True/False) Whether the crew member has signed a contract or not.
     * @param {int} hasBeenPaid - (True/False) Whether the crew member has been payed or not.
     * @param {int} eventID - The database ID of the event.
     * @param {int} crewCategoryID - The database ID of crew category the crew member will be assigned to.
     * @param {int} crewID - The database ID of the crew member.
     */
    static updateCrewMemberEvent(isResponsible, contractSigned, hasBeenPaid, eventID, crewCategoryID, crewID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/crew/' + crewID + '/event/' + eventID, {
            "isResponsible": isResponsible,
            "contractSigned": contractSigned,
            "hasBeenPaid": hasBeenPaid,
            "eventID": eventID,
            "crewCategoryID": crewCategoryID,
            "crewID": crewID
        },  {headers: header}).then(response => console.log(response));
    }

    /**
     * TODO - Currently unused - Update or delete?
     */
    static deleteCategory(crewCategoryID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID,  {headers: header})
            .then(response => console.log(response));
    }

    //delete a crew member
    static deleteCrewMember(contactID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/' + contactID,  {headers: header})
            .then(response => console.log(response));
    }

    /**
     * TODO - Currently unused - Update or delete?
     */
    static deleteCrewCategory(crewCategoryID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew-category/' + crewCategoryID,  {headers: header})
            .then(response => console.log(response));
    }

    /**
     * Unassigns a crewmember from an event and updates the database.
     * @param {int} eventID - The database ID of the event.
     * @param {int} crewCategoryID - The database ID of crew category the crew member will be assigned to.
     * @param {int} crewID - The database ID of the crew member.
     * @param {function} callback
     */
    static unassignCrewMemberFromEvent(eventID, crewCategoryID, crewID, callback){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID,  {headers: header})
            .then(response => callback(response.data));
    }

    /**
     * TODO - Currently unused - Update or delete?
     */
    static unassignCrewMember(crewCategoryID, crewID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/assign/' + crewID + '/' + crewCategoryID + '/' + crewID, {headers: header}).then(response => console.log(response));
    }

}