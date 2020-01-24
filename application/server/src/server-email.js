    import {app} from "./server";

const nodeMailer = require("nodemailer");
const mailConfig = require('./mailConfig');

app.post("/api/email", (request, response) => {
    console.log("Sending email");
    let host = mailConfig.Host;
    let mailUsername = mailConfig.Username;
    let password = mailConfig.Password;

    let harmonyUsername = request.body.username;
    let emailTo = request.body.emailTo;
    let subject = request.body.subject;
    let body = request.body.emailBody;
    let html = request.body.html;
    let attachmentLinks = request.body.attachmentLinks;

    let fileNames = null;

    if (attachmentLinks !== null){
        fileNames = attachmentLinks.map(link => link.split("_").slice(-1)[0]);
    }

    console.log(attachmentLinks);
    console.log(fileNames);

    let transporter = nodeMailer.createTransport({
        host: host,
        port: 587,
        secure: false,
        auth: {
            user: mailUsername,
            pass: password
        }
    });

    let attachments = null;

    if (attachmentLinks !== null){
        attachments = attachmentLinks.map((link, index) => {
            return {
                filename: fileNames[index],
                path: "./" + link
            }
        });
    }

    console.log(attachmentLinks);

    let mailData = {
        from: harmonyUsername,
        to: emailTo,
        subject: subject,
        text: body,
        html: html,
        attachments: attachments
    };

    console.log(mailData);

    transporter.sendMail(mailData).then(sendEmailResponse => {
        console.log(sendEmailResponse);
        response.status(200);
        response.json(sendEmailResponse);
    }).catch(error => {
        console.log(error);
        response.status(500);
        response.json(error);
    });
});

