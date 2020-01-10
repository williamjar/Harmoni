import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Document from ".classes/document.js"

class DocumentService {

    getAllDocumentsForOrganizer(organizerID) {
        return axios.get('/api/organizer/' + organizerID + '/documents').then(response => response.data);
    }

    getAllDocumentsForEvent(eventID){
        return axios.get('/api/events/' + eventID + '/documents').then(response => response.data);
    }

    addDocument(eventID, documentLink, artistID, documentCategoryID){
        axios.post('/api/document/', {
            "eventID": eventID,
            "documentLink": documentLink,
            "artistID": artistID,
            "documentCategoryID" : documentCategoryID
    }).then(response => response.data);
    }


    updateDocument(documentID, eventID, name, link, artistID, crewID, categoryID) {
        return axios.put('/api/document/' + documentID, {
            "eventID":eventID,
            "documentName": name,
            "documentLink": link,
            "artistID": artistID,
            "crewID": crewID,
            "documentCategoryID": categoryID
        }).then(response => response.data);
    }

    deleteDocument(id) {
        return axios.delete<Document>('/api/document/' + id).then(response => response.data);
    }

}