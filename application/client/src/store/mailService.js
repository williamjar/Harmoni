import axios from 'axios';
import {CookieStore} from "./cookieStore";

const axiosConfig = require('./axiosConfig');

/**
 * @class MailService
 * @classdesc Mail class for functions related to sending out emails.
 */
export class MailService {

    /**
     * Sends an email
     * @param {{(string|string[])}} emailTo - Email address of the recipient.
     * @param {string} subject - Subject line of the email.
     * @param {string} emailBody - Body of the email.
     * @param {Array} attachmentLinks - Sends a Array of strings with the links to attachments.
     * @param {function} callback
     */
    static sendGeneralEmail(emailTo, subject, emailBody, attachmentLinks, callback) {
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
            } else {
                callback(500);
            }
        }).catch(err => callback(500, err));
    }

    /**
     * Sends an email to a single recipient
     * @param {string} emailTo - Email address of the recipient.
     * @param {string} subject - Subject line of the email.
     * @param {string} emailBody - Body of the email.
     * @param {Array} attachmentLinks - Sends a Array of strings with the links to attachments.
     * @param {function} callback
     */
    static sendGeneralEmailToOne(emailTo, subject, emailBody, attachmentLinks, callback) {
        this.sendGeneralEmail(emailTo, subject, emailBody, attachmentLinks, callback);
    }

    /**
     * Sends an email to multiple recipients
     * @param {string[]} emailToArray - Email address of the recipient.
     * @param {string} subject - Subject line of the email.
     * @param {string} emailBody - Body of the email.
     * @param {Array} attachmentLinks - Sends a Array of strings with the links to attachments.
     * @param {function} callback
     */
    static sendGeneralEmailToMany(emailToArray, subject, emailBody, attachmentLinks, callback) {
        this.sendGeneralEmail(emailToArray, subject, emailBody, attachmentLinks, callback);
    }

    /**
     * Sends a cancel notice email to all artists and crew
     * @param {string} subject - Subject line of the email.
     * @param {string} emailBody - Body of the email.
     * @param {Array} artists - Array of artist objects to send the mail to.
     * @param {Array} crew - Array of crew objects to send the mail to.
     * @param {string} otherEmails - Body of the email.
     * @param {function} callback
     */
    static sendCancelNotice(subject, emailBody, artists, crew, otherEmails, callback) {
        let artistEmails = artists.map(artist => artist.email);
        let crewEmails = crew.map(crewMember => crewMember.email);
        let allEmails = [].concat(artistEmails).concat(crewEmails.concat(otherEmails));

        this.sendGeneralEmailToMany(allEmails, subject, emailBody, null, callback);
    }

    /**
     * Sends an email invitation to an artist.
     * @param {Artist} artist - The artist who will be the recipient.
     * @param {string} subject - Subject line of the email.
     * @param {string} emailBody - Body of the email.
     * @param {function} callback
     */
    static sendArtistInvitation(artist, subject, emailBody, callback) {

        let documentLinks = artist.documents.map(doc => doc.documentLink).filter(e => {
            return e;
        });

        this.sendGeneralEmail(artist.email, subject, emailBody, documentLinks, callback);
    }
}