import axios from "axios";
import {Document} from "../classes/document.js"
import {DocumentCategory} from "../classes/documentCategory";
import {CookieStore} from "./cookieStore";
import {Contact} from "../classes/contact";

const axiosConfig = require("./axiosConfig");

/**
 * @class DocumentService
 * @classdesc Store class for functions related to accessing and modifying documents.
 */
export class DocumentService {

    /**
     * Returns all documents for a document category for a specific event in a list of document objects created with data from the database
     * @param {int} eventID - The database ID of the event.
     * @param {int} documentCategoryID - The databaseID of the document category
     * @param {function} callback
     */
    static getAllDocumentsByCategoryForEvent(eventID, documentCategoryID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let documentsByCategoryForEvent = [];

        axios.get(axiosConfig.root + '/api/' + eventID + '/documents/category/' + documentCategoryID, {headers: header}).then(response => {
            documentsByCategoryForEvent = response.data.map(document => (
                new Document(document.documentID, document.eventID,
                    document.documentName, document.documentLink, document.artistID,
                    document.crewID, document.documentCategoryID)));
            callback(documentsByCategoryForEvent);
        });
    }

    /**
     * Returns all documents for a specific artist in a list of document objects created with data from the database
     * @param {int} artistID - The databaseID of the artist
     * @param {int} eventID - The database ID of the event.
     * @param {string} token - Generated token for artist to get access
     * @param {function} callback
     */
    static getAllDocumentsForArtist(artistID, eventID, token, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": token
        };

        axios.get(axiosConfig.root + "/artistapi/artist/documents/" + eventID + "/" + artistID, {headers: header})
            .then(response => {
                if (response.data) {
                    const documents = response.data.map(document => {
                        return {
                            documentID: document.documentID,
                            documentLink: document.documentLink,
                            documentName: document.documentLink.split("_").splice(-1)[0]
                        };
                    });
                    callback(200, documents);
                } else {
                    callback(500);
                }
            });
    }


    /**
     * Adds a new document to the database. Document can be attached to either a crew member or an artist.
     * TODO is category here needed?
     * @param {int} eventID - The database ID of the event.
     * @param {string} category - The category to add the event to
     * @param {int} artistID - The database ID of the artist to attach the document to. This and crewID can be left as null.
     * @param {int} crewID - The database ID of the crew to attach the document to. This and artistID can be left as null.
     * @param {int} documentCategoryID - The database ID of the document category to add the document to.
     * @param {FormData} file - TODO
     * @param {function} callback
     */
    static addDocument(eventID, category, artistID, crewID, documentCategoryID, file, callback) {

        let header = {
            "x-access-token": CookieStore.currentToken
        };

          axios.post(axiosConfig.root + '/api/file/document/' + eventID + '/' + documentCategoryID, file, {headers: header})
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": CookieStore.currentToken
                };

                if (!response.data.error) {

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


                    axios.post(axiosConfig.root + '/api/document', JSON.stringify(body), {headers: databaseHeader}).then(() => {
                        if (response.status === 200 && response.data.name) {
                            let returnData = {
                                "documentLink": path,
                                "documentID": response.data.insertId
                            };
                            callback(200, returnData);
                        } else {
                            callback(501, {"error": "An error occurred regarding saving file information to DB."});
                        }
                    });
                }

            });
    }

    /**
     * Allows the artist to upload a document and store it in the database.
     * @param {string} artistToken - Generated token for artist to get access
     * @param {int} eventID - The database ID of the event.
     * @param {int} artistID - The database ID of the artist to attach the document to. Either this or crewID is left as null.
     * @param {FormData} file - The database ID of the crew to attach the document to. Either this or artistID is left as null.
     * @param {function} callback
     */
    static addDocumentFromArtistPage(artistToken, eventID, artistID, file, callback) {

        let header = {
            "x-access-token": artistToken
        };

        axios.post(axiosConfig.root + '/artistapi/file/document/' + eventID + '/2', file, {headers: header})
            .then(response => {
                let databaseHeader = {
                    "Content-Type": "application/json",
                    "x-access-token": artistToken
                };

                if (!response.data.error) {

                    const path = response.data.path;
                    const name = response.data.name.split("_")[1];

                    //eventID, documentName, link, artistID, crewID, categoryID
                    let body = {
                        eventID: eventID,
                        documentName: name,
                        documentLink: path,
                        artistID: artistID,
                        crewID: null,
                        documentCategoryID: 2
                    };

                    axios.post(axiosConfig.root + '/artistapi/document', JSON.stringify(body), {headers: databaseHeader}).then(dataResponse => {

                        if (response.status === 200 && response.data.name) {
                            let returnData = {
                                "documentLink": path,
                                "documentID": dataResponse.data.insertId
                            };
                            callback(200, returnData);
                        } else {
                            callback(501, {"error": "An error occurred regarding saving file information to DB."});
                        }
                    });
                }

            });
    }

    static deleteDocument(documentID, documentLink) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };
        axios.delete(axiosConfig.root + '/api/document/' + documentID + '/' + documentLink, {headers: header})
            .catch(error => console.log(error));
    }

    static getAllDocumentCategories(callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        axios.get(axiosConfig.root + "/api/document/categories", {headers: header})
            .then(response => {
                let categories = response.data.map(dataPiece => new DocumentCategory(dataPiece.documentCategoryID, dataPiece.documentCategoryName));
                callback(categories);
            }).catch(callback(null)).catch(err => console.log(err));
    }

    /**
     * Returns a list of Document Category objects associated to an event created with data from the database in the callback.
     * @param {int} eventID - The database ID of the event.
     * @param {function} callback
     */
    static getAllDocumentCategoriesForEvent(eventID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let currentCategories = [];

        axios.get(axiosConfig.root + '/api/event/' + eventID + '/documents/categories', {headers: header}).then(response => {
            currentCategories = response.data.map(category => new DocumentCategory(category.documentCategoryID, category.documentCategoryName));

            callback(currentCategories);
        }).catch(res => console.log(res));
    }

    /**
     * Returns a contact object for an artist created with data from the database in the callback.
     * @param {int} documentID - Generated token for artist to get access
     * @param {function} callback
     */
    static getArtistInfoConnectedToDocument(documentID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let artist;
        axios.get(axiosConfig.root + '/api/document/info/artist/' + documentID, {headers: header}).then(response => {
           if(response.data[0] !== undefined){
               artist = new Contact(response.data[0].contactID, response.data[0].contactName,response.data[0].phone,response.data[0].email);
               callback(artist);
           }
            return undefined;
        }).catch(res => console.log(res));
    }

    /**
     * Returns a contact object for a crew member created with data from the database in the callback.
     * @param {int} documentID - Generated token for artist to get access
     * @param {function} callback
     */
    static getCrewInfoConnectedToDocument(documentID, callback) {
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let crew;
        axios.get(axiosConfig.root + '/api/document/info/crew/' + documentID, {headers: header}).then(response => {
            if(response.data[0] !== undefined){
                crew = new Contact(response.data[0].contactID, response.data[0].contactName,response.data[0].phone,response.data[0].email);
                callback(crew);
            }
            return undefined;
        }).catch(res => console.log(res));
    }

    static downloadDocument(documentLink, documentName){
        axios.get(axiosConfig.root + '/document/download/' + documentLink,
            {responseType: 'arraybuffer'}).then(res => {
            let url;

            //Checks which content-type is correct to file extension name
            //jpg/jpeg image
            if((/\.(jpeg)$/i).test(documentLink)){
               url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "image/jpeg"}));
            }

            else if((/\.(jpg)$/i).test(documentLink)){
                url = window.URL.createObjectURL(new Blob([res.data]
                    ,{type: "image/jpeg"}));
            }

            //Png image
            else if ((/\.(png)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "image/png"}));
            }

            //Postscript
            else if ((/\.(ai)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/postscript"}));
            }

            //PDF
            else if ((/\.(pdf)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/pdf"}));
            }
            //Microsoft Powerpoint
            else if ((/\.(pptx)$/i).test(documentLink) || (/\.(ppt)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"}));
            } else if ((/\.(ppt)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/vnd.ms-powerpoint"}));
            }
            //Microsoft Excel
            else if ((/\.(xlsx)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}));
            } else if ((/\.(xls)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/vnd.ms-excel"}));
            }

            //Microsoft Word
            else if ((/\.(docx)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}));
            } else if ((/\.(doc)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/msword"}));
            }
            //Compressed File
            else if ((/\.(rar)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/x-rar-compressed"}));
            } else if ((/\.(7z)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/x-7z-compressed"}));
            } else if ((/\.(zip)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/zip"}));
            }
            //Rich text format

            else if ((/\.(rtf)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "application/rtf"}));
            } else if ((/\.(rtx)$/i).test(documentLink)) {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: "text/richtext"}));
            } else {
                url = window.URL.createObjectURL(new Blob([res.data]
                    , {type: ""}));
            }
            let link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documentName);
            document.body.appendChild(link);
            link.click();
        });
    }

    /**
     * Previews a document via a link from the server.
     * @param {string} documentLink - The link to access the document.
     */
    static previewDocument(documentLink) {
        if ((/\.(pdf)$/i).test(documentLink)) {
            axios.get(axiosConfig.root + '/file/preview/' + documentLink, {
                method: "GET",
                responseType: "blob"
                //Force to receive data in a Blob Format
            }).then(response => {
                //Create a Blob from the PDF Stream
                const file = new Blob([response.data], {
                    type: "application/pdf"
                });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                window.open(fileURL);
            })
                .catch(error => {
                    console.log(error);
                });
        } else {
            console.log("Can only preview pdf documents");
        }
    }
}