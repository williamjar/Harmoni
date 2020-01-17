import {CookieStore} from "./cookieStore";
import axios from 'axios';

export class MailService{

    static sendGeneralEmail(emailTo, subject, emailBody, attachmentLinks, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        let body = {
            emailTo: emailTo,
            subject: subject,
            emailBody: emailBody,
            html: null,
            attachmentLinks: attachmentLinks
        };

        axios.post("http://localhost:8080/api/email", JSON.stringify(body), {headers: header}).then(response => {
            if (response.status === 200){
                callback(200, response.data);
            }
            else{
                callback(500);
            }
        }).catch(err => callback(500, err));
    }

    static sendArtistInvitation(artist, subject, emailBody, callback){

        let documentLinks = artist.documents.map(doc => doc.documentLink);

        this.sendGeneralEmail(artist.email, subject, emailBody, documentLinks, callback);
    }
}