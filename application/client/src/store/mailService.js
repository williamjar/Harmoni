import axios from 'axios';
import {CookieStore} from "./cookieStore";

const axiosConfig = require('./axiosConfig.json');


export class MailService{

    static sendGeneralEmail(emailTo, subject, emailBody, attachmentLinks, callback){
        let header = {
            "Content-Type": "application/json",
            "x-access-token": CookieStore.currentToken
        };

        if (attachmentLinks !== null){
            attachmentLinks = attachmentLinks.map(e => {if (e === undefined) return null; else return e});
        }


        let body = {
            username: 'bedriftharmoni@gmail.com',
            emailTo: emailTo,
            subject: subject,
            emailBody: emailBody,
            html: null,
            attachmentLinks: attachmentLinks
        };

        axios.post(axiosConfig.root + "/api/email", JSON.stringify(body), {headers: header}).then(response => {
            if (response.status === 200){
                callback(200, response.data);
            }
            else{
                callback(500);
            }
        }).catch(err => callback(500, err));
    }

    static sendGeneralEmailToOne(emailTo, subject, emailBody, attachmentLinks, callback){
        this.sendGeneralEmail(emailTo, subject, emailBody, attachmentLinks, callback);
    }

    static sendGeneralEmailToMany(emailToArray, subject, emailBody, attachmentLinks, callback){
        this.sendGeneralEmail(emailToArray, subject, emailBody, attachmentLinks, callback);
    }

    static sendCancelNotice(subject, emailBody, artists, crew, otherEmails, callback){
        let artistEmails = artists.map(artist => artist.email);
        let crewEmails = crew.map(crewMember => crewMember.email);
        let allEmails = [].concat(artistEmails).concat(crewEmails.concat(otherEmails));

        this.sendGeneralEmailToMany(allEmails, subject, emailBody, null, callback);
    }

    static sendArtistInvitation(artist, subject, emailBody, callback){

        console.log("Sending artist invitation");

        console.log(artist);

        let documentLinks = artist.documents.map(doc => doc.documentLink).filter(e => {
            return e;
        });

        console.log(documentLinks);

        this.sendGeneralEmail(artist.email, subject, emailBody, documentLinks, callback);
    }
}