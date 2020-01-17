import axios from "axios";
import {Document} from "../classes/document.js"
import {CookieStore} from "./cookieStore";
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
        console.log(eventID + "," + documentCategoryID);
        console.log(file);

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
                        let returnData = {
                            "documentLink": path,
                            "documentID": response.data.insertId
                        };
                        callback(200, returnData);
                    }
                    else{
                        callback(501, {"error": "An error occurred regarding saving file information to DB."});
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

}