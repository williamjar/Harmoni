import axios from "axios";
import {CookieStore} from "./cookieStore";
import {Component} from "react";
import {Bug} from "../classes/bug";
const axiosConfig = require("./axiosConfig");

/**
 * @class BugStore
 * @classdesc Store class for functions related to accessing and modifying bugs objects.
 */
export class BugStore extends Component {

    static allBugsReportedByOrganizer = [];

    /**
     * Register new bug into the database.
     * @param {int} organizerID - The database ID of the logged in organizer.
     * @param {string} description - Description of what went wrong.
     * @param {function} callback
     */
    static registerBug(organizerID, description, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            description: description
        }, {headers: header}).then(response => {
            if (response.status === 200) {
                callback(200);
            } else {
                callback(501);
            }
        })
    }

    /**
     * Register all bugs reported by the logged in user.
     * @param {int} organizerID - The database ID of the logged in organizer.
     * @param {function} callback
     */
   static getAllBugsFromOrganizer(organizerID, callback){

       this.allBugsReportedByOrganizer = [];

       let header = {
           "Content-Type": "application/json",
           "x-access-token": CookieStore.currentToken
       };
       axios.get(axiosConfig.root + '/api/bug/organizer/' + organizerID, {headers: header}).then( response => {
           this.allBugsReportedByOrganizer = response.data.map(bug => new Bug(bug.bugID, bug.date, bug.description, bug.organizerID));
           callback();
       });
   }

    /**
     * Deletes a bug from a database.
     * @param {int} bugID - The database ID of the bug.
     * @param {function} callback
     */
    static deleteBug(bugID, callback) {

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/bug/delete/' + bugID, {headers: header}).then(response => {
            if (response.status === 200){
                callback(200);
            }
            else{
                callback(501);
            }
        });
    }
}

