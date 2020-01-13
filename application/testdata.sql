-- Prepared
-- INSERT INTO genre (genreID,genreName) VALUES (?,?);
-- INSERT INTO picture (pictureLink) VALUES (?);
-- INSERT INTO eventType (eventTypeID,eventTypeName) VALUES (?,?);
-- INSERT INTO contact (contactName, phone, email) VALUES (?,?,?);
-- INSERT INTO documentCategory (documentCategoryID,documentCategoryName) VALUES (?,?);
--
-- INSERT INTO event (eventName,organizerID) VALUES (?,?);
-- INSERT INTO event (eventName,startDate,endDate,startTime,endTime,address,town,zipCode,description,publishDate,publishTime,organizerID,eventTypeID,pictureID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);
--
-- INSERT INTO organizer (username, password, pictureID, contactID) VALUES (?,?,?,?);
-- INSERT INTO ticketType (eventID,ticketTypeName,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description) VALUES (?,?,?,?,?,?,?,?,?,?);
-- INSERT INTO artist (genreID,organizerID,contactID) VALUES (?,?,?);
-- INSERT INTO event_artist (eventID,artistID) VALUES (?,?);
-- INSERT INTO crew (description,organizerID,contactID) VALUES (?,?,?);
-- INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES (?,?);
-- INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (?,?,?,?);
-- INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (?,?,?,?,?,?);
--
-- INSERT INTO document (eventID,documentName,documentLink,documentCategoryID) VALUES (?,?,?,?);
-- INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (?,?,?,?,?);
-- INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (?,?,?,?,?);

-- Test Data
INSERT INTO genre (genreID,genreName) VALUES (1,'Pop');
INSERT INTO genre (genreID,genreName) VALUES (2,'Rock');
INSERT INTO genre (genreID,genreName) VALUES (3,'Metal');
INSERT INTO genre (genreID,genreName) VALUES (4,'Folk');

INSERT INTO picture (pictureLink) VALUES ('Link her');

INSERT INTO eventType (eventTypeID,eventTypeName) VALUES (1,'Konsert');
INSERT INTO eventType (eventTypeID,eventTypeName) VALUES (2,'Festival');
INSERT INTO eventType (eventTypeID,eventTypeName) VALUES (3,'Konkurranse');

-- Organizers
INSERT INTO contact (contactName, phone, email) VALUES ('Geir', '48484848', 'geir@lillelondon.no');
INSERT INTO contact (contactName, phone, email) VALUES ('Arne', '47474747', 'planning@localevents.com');
-- Artists
INSERT INTO contact (contactName, phone, email) VALUES ('Anne', '92929292', 'anne@music.no');
INSERT INTO contact (contactName, phone, email) VALUES ('Demon SlayerZ', '66666666', 'dmonZ@cdrecords.no');
-- CrewTab
INSERT INTO contact (contactName, phone, email) VALUES ('Svein', '+4793939393', 'kontakt@rigging.no');
INSERT INTO contact (contactName, phone, email) VALUES ('Roger', '+4793939393', 'kontakt@rigging.no');

INSERT INTO organizer (username,password,pictureID,contactID) VALUES ('LilleLondon', 'salted/hashed passord',1,1);
INSERT INTO organizer (username,password,pictureID,contactID) VALUES ('LocalEvents', 'salted/hashed passord',1,2);

INSERT INTO artist (genreID,organizerID,contactID) VALUES (1,1,3);
INSERT INTO artist (genreID,organizerID,contactID) VALUES (3,2,4);

INSERT INTO crew (description,organizerID,contactID) VALUES ('Ledig hver hvelg',1,5);
INSERT INTO crew (description,organizerID,contactID) VALUES ('Synes han er ganske frekk',2,6);

INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES ('Rigging',1);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES ('Lyd',1);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES ('Lys',1);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES ('Rigging',2);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES ('Lyd&Lys',2);

INSERT INTO event (eventName,organizerID) VALUES ('Fredagskveld hos Lille London',1);

INSERT INTO event (eventName,startDate,endDate,startTime,endTime,address,town,zipCode,description,publishDate,publishTime,organizerID,eventTypeID,pictureID)
VALUES ('Beelzebub Festival 2020','2020-05-10','2020-05-13','16:00','20:00','Môrktunet 6','Tromsø','666','En helg full av mørke','2020-01-20','13:00',2,2,null);

INSERT INTO ticketType (eventID,ticketTypeName,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description)
VALUES (1,'Standard',50,50,'2020-02-01','14:00',0,null,null,'Stå og sitteplasser');

INSERT INTO ticketType (eventID,ticketTypeName,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description)
VALUES (2,'Standard',499,500,'2020-01-20','14:00',0,null,null,'Gjelder alle dager');

INSERT INTO ticketType (eventID,ticketTypeName,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description)
VALUES (2,'Early-Bird',449,150,'2020-02-01','14:00',1,'2020-01-20','2020-02-01','Gjelder alle dager');

INSERT INTO documentCategory (documentCategoryID,documentCategoryName) VALUES (1,'Kontrakt');
INSERT INTO documentCategory (documentCategoryID,documentCategoryName) VALUES (2,'Rider');
INSERT INTO documentCategory (documentCategoryID,documentCategoryName) VALUES (3,'Annet');

INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (1,'Anne.pdf','Link her',1,1);
INSERT INTO document (eventID,documentName,documentLink,documentCategoryID) VALUES (1,'Notater.txt','Link her',3);
INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (2,'Demon SlayerZ.pdf','Link her',2,1);
INSERT INTO document (eventID,documentName,documentLink,artistID,documentCategoryID) VALUES (2,'Demon SlayerZ.doc','Link her',2,2);
INSERT INTO document (eventID,documentName,documentLink,crewID,documentCategoryID) VALUES (2,'Svein.pdf','Link here',1,1);

INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (1,1,2,1);
INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (2,2,2,1);
INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (2,4,1,0);

INSERT INTO event_artist (eventID,artistID) VALUES (1,1);
INSERT INTO event_artist (eventID,artistID) VALUES (2,2);

INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (1,1,1,null,1,'Et glass lunkent vann');
INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (2,1,1,'Må dra innom butikken',0,'Brødskive med hvitost');
INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (1,2,2,'Dobbeltsjekk tilgjengelighet',0,'3 stk. smalahove');

INSERT INTO bug (date,description,organizerID, resolved) VALUES (now(),'Everything crashed',1, 0);
INSERT INTO bug (date,organizerID, resolved) VALUES (now(),1, 1);
