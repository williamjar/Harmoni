import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Document from ".classes/document.js"

class DocumentService {

    getAllDocumentsForOrganizer(organizerID) {
        return axios.get<Document[]>('/api/organizer/' + organizerID + '/documents').then(response => response.data);
    }

    getAllDocumentsForEvent(eventID){
        return axios.get<Document[]>('/api/events/' + eventID + '/documents').then(response => response.data);
    }

    addDocument(eventID, documentLink, artistID, documentCategoryID){
        axios.post('/api/document/', {
            "eventID": eventID,
            "documentLink": documentLink,
            "artistID": artistID,
            "documentCategoryID" : documentCategoryID
    }).then(response => response.data);
    }


    updateDocument(document) {
        return axios.put<Document, void>('/api/document/' + id, document).then(response => response.data);
    }

    deleteDocument(id) {
        return axios.delete<Document>('/api/document/' + id).then(response => response.data);
    }

}