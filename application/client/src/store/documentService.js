import axios from "axios";
import {Document} from "../classes/document.js"
import {CookieStore} from "./cookieStore";
import {DocumentCategory} from "../classes/documentCategory";
import {EventStore} from "./eventStore";
import {Contact} from "../classes/contact";

const axiosConfig = require("./axiosConfig");

export class DocumentService {


    static getAllDocumentsByCategoryForEvent(eventID, documentCategoryID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let documentsByCategoryForEvent = [];

        axios.get(axiosConfig.root + '/api/' + eventID + '/documents/category/' + documentCategoryID, {headers: header}).then(response => {
            for (let i = 0; i < response.data.length; i++) {
                documentsByCategoryForEvent.push(new Document(response.data[i].documentID, response.data[i].eventID,
                    response.data[i].documentName, response.data[i].documentLink, response.data[i].artistID,
                    response.data[i].crewID, response.data[i].documentCategoryID));
            }
            callback(documentsByCategoryForEvent);
        });
    }

//TODO: Delete? change Document params if not
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

//TODO: Delete? change Document params if not
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

//TODO: Delete? change Document params if not
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

//TODO: Delete? change Document params if not
    deleteDocument(id) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        return axios.delete(axiosConfig.root + '/api/document/' + id, {headers: header}).then(response => response.data);
    }

//TODO: Delete? change Document params if not
    insertDocumentArtist(eventID, folderName, documentCategoryID, artistID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID + '/artist/' + artistID)
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
    }

    //TODO: Delete? change Document params if not
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

        axios.get(axiosConfig.root + '/api/event/' + eventID + '/documents/categories', {headers: header}).then(response => {
            for (let i = 0; i < response.data.length; i++) {
                currentCategories.push(new DocumentCategory(response.data[i].documentCategoryID,
                    response.data[i].documentCategoryName));
            }

            callback(currentCategories);
        }).catch(res => console.log(res));
    }

    static getOneDocument(eventID, documentID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let document;


        axios.get(axiosConfig.root + '/api/' + eventID + '/documents/' + documentID, {headers: header}).then(response => {
            console.log(response.data.length);
            for (let i = 0; i < response.data.length; i++) {
                document = new Document(response.data[i].documentID, response.data[i].eventID,
                    response.data[i].documentName, response.data[i].documentLink, response.data[i].artistID,
                    response.data[i].crewID, response.data[i].documentCategoryID);
            }
            console.log(document.documentName);

            callback(document);
        }).catch(res => console.log(res));
    }

    //TODO: implement in file info
    static getArtistInfoConnectedToDocument(documentID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let artist;


        axios.get(axiosConfig.root + '/api/artist/documents/' + documentID, {headers: header}).then(response => {
            artist = new Contact(response.data.contactName,response.data.phone,response.data.email,);
            callback(artist);
        }).catch(res => console.log(res));
    }

    //TODO: implement in file info
    static getCrewInfoConnectedToDocument(documentID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let crew;
        axios.get(axiosConfig.root + '/api/crew/documents/' + documentID, {headers: header}).then(response => {
            crew = new Contact(response.data.contactName,response.data.phone,response.data.email,);
            callback(crew);
        }).catch(res => console.log(res));
    }

    static downloadDocument(documentLink, doucmentName){
        axios.get(axiosConfig.root + '/api/document/download/' + documentLink,
            {responseType: 'arraybuffer'}).then(res => {
            let url;

            //Checks which content-type is correct to file extension name
            //jpg/jpeg image
            if((/\.(jpeg)$/i).test(documentLink) || (/\.(jpg)$/i).test(documentLink)){
               url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "image/jpeg"}));
            }
            //Png image
            else if((/\.(png)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "image/png"}));
            }

            //Postscript
            else if((/\.(ai)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/postscript"}));
            }

            //PDF
            else if((/\.(pdf)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/pdf"}));
            }
            //Microsoft Powerpoint
            else if((/\.(pptx)$/i).test(documentLink) || (/\.(ppt)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"}));
            }
            else if((/\.(ppt)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/vnd.ms-powerpoint"}));
            }
            //Microsoft Excel
            else if((/\.(xlsx)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
            }

            else if((/\.(xls)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/vnd.ms-excel"}));
            }

            //Microsoft Word
            else if((/\.(docx)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));
            }

            else if((/\.(doc)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/msword"}));
            }
            //Compressed File
            else if((/\.(rar)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/x-rar-compressed"}));
            }

            else if((/\.(7z)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/x-7z-compressed"}));
            }
            else if((/\.(zip)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/zip"}));
            }
            //Rich text format

            else if((/\.(rtf)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "application/rtf"}));
            }
            else if((/\.(rtx)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "text/richtext"}));
            }
            else {
                console.log("There are no MIME support to " + documentLink);
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: ""}));
            }
            var link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doucmentName);
            document.body.appendChild(link);
            link.click();
        });
        console.log("Downloading document...");
    }
}