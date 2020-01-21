import axios from "axios";
import {CookieStore} from "./cookieStore";
import {Component} from "react";
import {TicketType} from "../classes/ticketType";
import {Bug} from "../classes/bug";
const axiosConfig = require("./axiosConfig");

export class BugStore extends Component {

    static allBugsReportedByOrganizer = [];

    //Register bug
    static registerBug(organizerID, description, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {

            description: description
        }, {headers: header}).then(response => {
            console.log(response);
            if (response.status === 200) {
                callback(200);
            } else {
                callback(501);
            }
        })
    }

   // return all bugs registraded by one organizer.
   static getAllBugsFromOrganizer(organizerID, callback){

       this.allBugsReportedByOrganizer = [];

       let header = {
           "Content-Type": "application/json",
           "x-access-token": CookieStore.currentToken
       };
       axios.get(axiosConfig.root + '/api/bug/organizer/' + organizerID, {headers: header}).then( response => {
           for (let i = 0; i < response.data.length; i++){
               this.allBugsReportedByOrganizer.push(new Bug(response.data[i].bugID, response.data[i].date, response.data[i].description, response.data[i].organizerID));
           }
           callback()
       });
   }

    //delete bugs
    static deleteBug(bugID, callback) {
        console.log('Running delete bug');

        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/bug/delete/' + bugID, {headers: header}).then(response => {
            console.log(response);
            if (response.status === 200){
                callback(200);
            }
            else{
                callback(501);
            }
        });
    }
}

