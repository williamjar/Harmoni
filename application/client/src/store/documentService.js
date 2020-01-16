import axios from "axios";
import {Document} from "../classes/document.js"
import {CookieStore} from "./cookieStore";
import {DocumentCategory} from "../classes/documentCategory";
import {EventStore} from "./eventStore";

const axiosConfig = require("./axiosConfig");

export class DocumentService {



    getAllDocumentsForOrganizer(organizerID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        let allDocumentsByOrganizer = [];
        axios.get(axiosConfig.root + '/api/organizer/' + organizerID + '/documents', {headers: header}).then(response => {
            for (let i = 0; i < response.data.length; i++) {
                allDocumentsByOrganizer.push(new Document(response.data[i].documentID, response.data[i].documentLink,
                    response.data[i].documentCategory));
            }
        });
        return allDocumentsByOrganizer;
    }


    getAllDocumentsForEvent(eventID){
        let allDocumentsByEvent = [];
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.get(axiosConfig.root + '/api/events/' + eventID + '/documents', {headers: header}).then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allDocumentsByEvent.push(new Document(response.data[i].documentID, response.data[i].documentLink,
                    response.data[i].documentCategory));
            }
        });
        return allDocumentsByEvent;
    }

    static addDocument(eventID, category, artistID, crewID, documentCategoryID, file, callback){

          axios.post('http://localhost:8080/api/file/document/' + eventID + '/' + documentCategoryID, file)
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                const path = response.data.path;
                const name = response.data.name.split("_")[1];

                //eventID, documentName, link, artistID, crewID, categoryID
                let body = {
                    eventID: eventID,
                    documentName: name,
                    documentLink: path,
                    artistID: artistID,
                    crewID: crewID,
                    documentCategoryID: documentCategoryID
                };

                console.log(body);

                axios.post('http://localhost:8080/api/document', JSON.stringify(body), {headers: databaseHeader}).then(() => {
                    console.log(response.status);
                    console.log(response.data);
                    if (response.status === 200 && response.data.name){
                        callback(200);
                    }
                    else{
                        callback(501);
                    }
                });
        });
    }


    updateDocument(documentID, eventID, name, link, artistID, crewID, categoryID) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.put(axiosConfig.root + '/api/document/' + documentID, {
            "eventID":eventID,
            "documentName": name,
            "documentLink": link,
            "artistID": artistID,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }, {headers: header}).then(response => response.data);
    }

    deleteDocument(id) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/document/' + id, {headers: header}).then(response => response.data);
    }


    insertDocumentArtist(eventID, folderName, documentCategoryID, artistID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID + '/artist/' + artistID)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }

    insertDocumentCrew(eventID, folderName, documentCategoryID, crewID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID + '/crew/' + crewID)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }

    static getAllDocumentCategoriesForEvent(eventID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let currentCategories = [];

        axios.get(axiosConfig.root + '/api/' + eventID + '/documents/categories', {headers: header}).then(response => {
            for (let i = 0; i < response.data.length; i++) {
                currentCategories.push(new DocumentCategory(response.data[i].documentCategoryID,
                    response.data[i].documentCategoryName));
            }
            callback(currentCategories);
        });
    }

}