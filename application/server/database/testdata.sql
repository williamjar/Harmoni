-- Prepared
INSERT INTO bug (date,description,organizerID) VALUES (?,?,?);
INSERT INTO bug (date,organizerID) VALUES (?,?);

INSERT INTO genre (genreID,genreName) VALUES (?,?);
INSERT INTO picture (pictureLink) VALUES (?);
INSERT INTO eventType (eventTypeName) VALUES (?);
INSERT INTO contact (contactName, phone, email) VALUES (?,?,?);
INSERT INTO documentCategory (documentCategoryName) VALUES (?);

INSERT INTO event (eventName) VALUES (?);
INSERT INTO event (eventName,startDate,endDate,startTime,endTime,address,town,zipCode,description,publishDate,publishTime,organizerID,eventTypeID,pictureID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);

INSERT INTO organizer (username, password, pictureID, contactID) VALUES (?,?,?,?);
INSERT INTO ticketType (ticketTypeID,eventID,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description) VALUES (?,?,?,?,?,?,?,?,?,?);
INSERT INTO artist (genreID,organizerID,contactID) VALUES (?,?,?);
INSERT INTO event_artist (eventID,artistID) VALUES (?,?);
INSERT INTO crew (description,organizerID) VALUES (?,?);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES (?,?);
INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (?,?,?,?);
INSERT INTO document (eventID,documentLink,artistID,documentCategoryID) VALUES (?,?,?,?);
INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (?,?,?,?,?,?);

-- Test Data
INSERT INTO bug (date,description,organizerID) VALUES (now(),'Everything crashed',1);
INSERT INTO bug (date,organizerID) VALUES (now(),1);

INSERT INTO genre (genreID,genreName) VALUES (1,'Pop');
INSERT INTO genre (genreID,genreName) VALUES (1,'Rock');
INSERT INTO genre (genreID,genreName) VALUES (1,'Metal');
INSERT INTO genre (genreID,genreName) VALUES (1,'Folk');

INSERT INTO picture (pictureLink) VALUES (?);

INSERT INTO eventType (eventTypeName) VALUES ('Konsert');
INSERT INTO eventType (eventTypeName) VALUES ('Festival');
INSERT INTO eventType (eventTypeName) VALUES ('Konkurranse');

INSERT INTO contact (contactName, phone, email) VALUES ('Geir', '48484848', 'geir@lillelondon.no');
INSERT INTO contact (contactName, phone, email) VALUES ('Anne', '92929292', 'anne@music.no');
INSERT INTO contact (contactName, phone, email) VALUES ('Elias', '42424242', 'elias@crew.no');

INSERT INTO documentCategory (documentCategoryName) VALUES ('Kontrakt');
INSERT INTO documentCategory (documentCategoryName) VALUES ('Rider');
INSERT INTO documentCategory (documentCategoryName) VALUES ('Annet');

INSERT INTO event (eventName) VALUES ('Fredagskveld hos Lille London');

INSERT INTO event (eventName,startDate,endDate,startTime,endTime,address,town,zipCode,description,publishDate,publishTime,organizerID,eventTypeID,pictureID)
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);


INSERT INTO organizer (username, password, pictureID) VALUES (?,?,?);
INSERT INTO ticketType (ticketTypeID,eventID,price,amount,releaseDate,releaseTime,hasEndDate,endDate,endTime,description) VALUES (?,?,?,?,?,?,?,?,?,?);
INSERT INTO artist (genreID,organizerID,contactID) VALUES (?,?,?);
INSERT INTO event_artist (eventID,artistID) VALUES (?,?);
INSERT INTO crew (description,organizerID) VALUES (?,?);
INSERT INTO crewCategory (crewCategoryName,organizerID) VALUES (?,?);
INSERT INTO event_crewCategory_crew (eventID,crewCategoryID,crewID,isResponsible) VALUES (?,?,?,?);
INSERT INTO document (eventID,documentLink,artistID,documentCategoryID) VALUES (?,?,?,?);
INSERT INTO riderElement (riderElementID,artistID,eventID,status,isDone,description) VALUES (?,?,?,?,?,?);
