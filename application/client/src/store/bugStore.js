import axios from "axios";
import {CookieStore} from "./cookieStore";
import {Component} from "react";
const axiosConfig = require("./axiosConfig");

export class BugStore extends Component {

    static getAllReportetBugs = [];

    getOneBug(bugID, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get(`/api/bug/` + bugID, {headers: header}).then(() => callback());
    }

    getAllBugs(callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.get('/api/bug', {headers: header}).then(() => callback());
    }

    //Register bug
    static registerBug(organizerID, description, date, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.post(axiosConfig.root + '/api/bug/register/' + organizerID, {
            date: date,
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
}