import axios from "axios";
import {sharedComponentData} from "react-simplified";
import Document from ".classes/document.js"

class DocumentService {

    getAllDocumentsForOrganizer(organizerID: number) {
        return axios.get<Document[]>('/api/organizer/' + organizerID + '/documents').then(response => response.data);
    }

    getAllDocumentsForEvent(eventID: number){
        return axios.get<Document[]>('/api/events/' + eventID + '/documents').then(response => response.data);
    }

    addDocument(){
        return axios.post<Document, void>('/api/document/', document).then(response => response.data);
    }

    updateDocument(document: Document) {
        return axios.put<Document, void>('/api/document/' + id, document).then(response => response.data);
    }

    deleteDocument(id: number) {
        return axios.delete<Document>('/api/document/' + id).then(response => response.data);
    }

}