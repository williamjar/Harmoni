import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Document from ".classes/document.js"

const axiosConfig = require("./axiosConfig");

class DocumentService {

    getAllDocumentsForOrganizer(organizerID) {
        let allDocumentsByOrganizer = [];
        axios.get(axiosConfig.root + '/api/organizer/' + organizerID + '/documents').then(response => {
            for (let i = 0; i < response.data.length; i++) {
                allDocumentsByOrganizer.push(new Document(response.data[i].documentID, response.data[i].documentLink,
                    response.data[i].documentCategory));
            }
        });
        return allDocumentsByOrganizer;
    }


    getAllDocumentsForEvent(eventID){
        let allDocumentsByEvent = [];
        axios.get(axiosConfig.root + '/api/events/' + eventID + '/documents').then(response =>  {
            for (let i = 0; i < response.data.length; i++) {
                allDocumentsByEvent.push(new Document(response.data[0].documentID, response.data[0].documentLink,
                    response.data[0].documentCategory));
            }
        });
        return allDocumentsByEvent;
    }

    addDocument(eventID, documentLink, artistID, documentCategoryID){
        axios.post(axiosConfig.root + '/api/document/', {
            "eventID": eventID,
            "documentLink": documentLink,
            "artistID": artistID,
            "documentCategoryID" : documentCategoryID
    }).then(response => response.data);
    }


    updateDocument(documentID, eventID, name, link, artistID, crewID, categoryID) {
        return axios.put(axiosConfig.root + '/api/document/' + documentID, {
            "eventID":eventID,
            "documentName": name,
            "documentLink": link,
            "artistID": artistID,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }).then(response => response.data);
    }

    deleteDocument(id) {
        return axios.delete(axiosConfig.root + '/api/document/' + id).then(response => response.data);
    }

    insertDocument(eventID, folderName, documentCategoryID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID)
            .then(response => response.data);
    }

    insertDocumentArtist(eventID, folderName, documentCategoryID, artistID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID + '/artist/' + artistID)
            .then(response => response.data);
    }

    insertDocumentCrew(eventID, folderName, documentCategoryID, crewID){
        axios.post(axiosConfig.root + '/api/documents/upload/' + eventID + '/' + folderName + '/' + documentCategoryID + '/crew/' + crewID)
            .then(response => response.data);
    }

}