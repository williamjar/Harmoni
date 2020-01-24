import axios from "axios";
import {CrewMember} from "../classes/crewMember.js"
import {CookieStore} from "./cookieStore";
import {CrewCategory} from "../classes/crewCategory";

let axiosConfig = require("./axiosConfig");

/**
 * @class CrewStore
 * @classdesc Store class for functions related to accessing and modifying crew objects.
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

            this.allCrewMembersForOrganizer = response.data.map(data => new CrewMember(data.crewID, data.contactID, data.description, data.crewCategoryID,
                data.crewCategoryName, data.contactName, data.phone, data.email));

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

            this.allCrewForCurrentEvent = response.data.map(data => new CrewMember(data.crewID, data.contactID, data.description, data.crewCategoryID,
                data.crewCategoryName, data.contactName, data.phone, data.email, (data.isResponsible === 1), (data.contractSigned === 1), (data.hasBeenPaid === 1)))

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

            this.allCrewCategoriesForOrganizer = response.data.map(data => new CrewCategory (data.crewCategoryID, data.crewCategoryName));

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

            this.allCrewCategoriesForCurrentEvent = response.data.map(data => new CrewCategory (data.crewCategoryID, data.crewCategoryName));

            callback();
        });
    }

    /**
     * Creates a new crew member and assigns it to the current event. The crew member is then stores in the database
     * @param {function} callback
     * @param {string} name - The name of the new crew member.
     * @param {string} phone - The phone of the new crew member.
     * @param {string} email - The email of the new crew member.
     * @param {string} description - A description the new crew member.
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
     * @param {string} name - The name of the new crew member.
     * @param {string} phone - The phone of the new crew member.
     * @param {string} email - The email of the new crew member.
     * @param {string} description - A description the new crew member.
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
            let crewBody = {
                "description": description,
                "organizerID": organizerID,
                "contactID": response.data.insertId
            };

            axios.post(axiosConfig.root + '/api/crew', crewBody, {headers: header}).then(response => {
                callback();
            });
        });
    }

    /**
     * Creates a new crew category for that organizer and saves it to the database.
     * @param {string} categoryName - The name of the new crew category.
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
        },  {headers: header}).then(response => console.log("Category added"));
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
     * Updates the the description for an existing crew member and saves it to the database.
     * @param {string} description - The database ID of the event.
     * @param {crewID} crewID - The database ID of the crew member.
     * @return {Promise} The promise received from the database.
     */
    static updateCrewMember(description, crewID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.put(axiosConfig.root + '/api/crew/' + crewID, {
            "description": description,
            "crewID": crewID
        },  {headers: header}).then(response => console.log("Crew updated"));
    }

    /**
     * Update crew member as responsible in a category for an event.
     * @param {int} isResponsible - (True/False) Whether the crew member is set to be the responsible for that category.
     * @param {int} contractSigned - (True/False) Whether the crew member has signed a contract or not.
     * @param {int} hasBeenPaid - (True/False) Whether the crew member has been payed or not.
     * @param {int} eventID - The database ID of the event.
     * @param {int} crewCategoryID - The database ID of crew category the crew member will be assigned to.
     * @param {int} crewID - The database ID of the crew member.
     * @return {Promise} The promise received from the database.
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
        },  {headers: header}).then(response => console.log("Crew member updated"));
    }


    /**
     * Removes a crew member and his personal info from the database.
     * @param {int} contactID - The database ID of the contact.
     * @return {Promise} The promise received from the database.
     */
    static deleteCrewMember(contactID) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/' + contactID,  {headers: header})
            .then(response => console.log("Crew member deleted"));
    }


    /**
     * Unassigns a crew member from an event and updates the database.
     * @param {int} eventID - The database ID of the event.
     * @param {int} crewCategoryID - The database ID of crew category the crew member will be assigned to.
     * @param {int} crewID - The database ID of the crew member.
     * @param {function} callback
     * @return {Promise} The promise received from the database.
     */
    static unassignCrewMemberFromEvent(eventID, crewCategoryID, crewID, callback){

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        return axios.delete(axiosConfig.root + '/api/crew/assign/' + eventID + '/' + crewCategoryID + '/' + crewID,  {headers: header})
            .then(response => callback(response.data));
    }

}