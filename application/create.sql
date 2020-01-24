drop table if exists bug;

drop table if exists document;

drop table if exists documentCategory;

drop table if exists event_artist;

drop table if exists event_crewCategory_crew;

drop table if exists crew;

drop table if exists crewCategory;

drop table if exists riderElement;

drop table if exists artist;

drop table if exists genre;

drop table if exists ticketType;

drop table if exists event;

drop table if exists eventType;

drop table if exists organizer;

drop table if exists contact;

drop table if exists picture;

CREATE TABLE bug(
    bugID INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    description VARCHAR(255),
    organizerID INT,
    resolved TINYINT(1)
);

CREATE TABLE genre(
    genreID INT PRIMARY KEY,
    genreName VARCHAR(100)
);

CREATE TABLE picture(
    pictureID INT AUTO_INCREMENT PRIMARY KEY,
    pictureLink TEXT
);

CREATE TABLE eventType(
    eventTypeID INT PRIMARY KEY,
    eventTypeName VARCHAR(100)
);

CREATE TABLE contact(
    contactID INT AUTO_INCREMENT PRIMARY KEY,
    contactName VARCHAR(128),
    phone VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE documentCategory(
    documentCategoryID INT PRIMARY KEY,
    documentCategoryName VARCHAR(100)
);

CREATE TABLE event(
    eventID INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(100),
    startDate DATE,
    endDate DATE,
    startTime VARCHAR(10),
    endTime VARCHAR(10),
    address VARCHAR(100),
    town VARCHAR(100),
    zipCode INT,
    status INT NOT NULL DEFAULT 0,
    description TEXT,
    publishDate DATE,
    publishTime VARCHAR(10),
    organizerID INT NOT NULL,
    eventTypeID INT,
    pictureID INT
);

CREATE TABLE organizer(
  organizerID INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(500),
  pictureID INT,
  contactID INT
);

CREATE TABLE ticketType(
    ticketTypeID INT AUTO_INCREMENT,
    eventID INT NOT NULL,
    ticketTypeName VARCHAR(100),
    price INT,
    amount INT,
    releaseDate DATE,
    releaseTime VARCHAR(10),
    hasEndDate TINYINT(1),
    endDate DATE,
    endTime VARCHAR(10),
    description TEXT,
    PRIMARY KEY (ticketTypeID, eventID)
);

CREATE TABLE artist(
    artistID INT AUTO_INCREMENT PRIMARY KEY,
    genreID INT,
    organizerID INT,
    contactID INT
);

CREATE TABLE event_artist(
    eventID INT,
    artistID INT,
    contractSigned TINYINT(1) DEFAULT 0 NOT NULL,
    hasBeenPaid    TINYINT(1) DEFAULT 0 NOT NULL,
    PRIMARY KEY(eventID, artistID)
);

CREATE TABLE crew(
    crewID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    organizerID INT NOT NULL,
    contactID INT
);

CREATE TABLE crewCategory(
    crewCategoryID INT AUTO_INCREMENT PRIMARY KEY,
    crewCategoryName VARCHAR(100),
    organizerID INT NOT NULL
);

CREATE TABLE event_crewCategory_crew(
    eventID INT,
    crewCategoryID INT,
    crewID INT,
    isResponsible TINYINT(1) DEFAULT  0 NOT NULL,
    contractSigned tinyint(1) DEFAULT  0 NOT NULL,
    hasBeenPaid    tinyint(1) DEFAULT  0 NOT NULL,
    PRIMARY KEY(eventID, crewCategoryID, crewID)
);

CREATE TABLE document(
    documentID INT AUTO_INCREMENT,
    eventID INT NOT NULL,
    documentName VARCHAR(100),
    documentLink TEXT,
    artistID INT,
    crewID INT,
    documentCategoryID INT NOT NULL,
    PRIMARY KEY(documentID, eventID)
);

CREATE TABLE riderElement(
    riderElementID INT AUTO_INCREMENT,
    artistID INT,
    eventID INT,
    status VARCHAR(255),
    isDone TINYINT(1),
    description TEXT,
    PRIMARY KEY(riderElementID, artistID, eventID)
);


ALTER TABLE event
ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID) ON DELETE CASCADE,
ADD FOREIGN KEY (eventTypeID) REFERENCES eventType(eventTypeID),
ADD FOREIGN KEY (pictureID) REFERENCES picture(pictureID);

ALTER TABLE organizer
ADD FOREIGN KEY (pictureID) REFERENCES picture(pictureID),
ADD FOREIGN KEY (contactID) REFERENCES contact(contactID) ON DELETE CASCADE;

ALTER TABLE ticketType ADD FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE;

ALTER TABLE artist
ADD FOREIGN KEY (genreID) REFERENCES genre(genreID),
ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID) ON DELETE CASCADE,
ADD FOREIGN KEY (contactID) REFERENCES contact(contactID) ON DELETE CASCADE;

ALTER TABLE event_artist
ADD FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE,
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID) ON DELETE CASCADE;

ALTER TABLE crew
ADD FOREIGN KEY (contactID) REFERENCES contact(contactID) ON DELETE CASCADE,
ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID) ON DELETE CASCADE;

ALTER TABLE crewCategory ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID);

ALTER TABLE event_crewCategory_crew
ADD FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE,
ADD FOREIGN KEY (crewCategoryID) REFERENCES crewCategory(crewCategoryID),
ADD FOREIGN KEY (crewID) REFERENCES crew(crewID) ON DELETE CASCADE;

ALTER TABLE document
ADD FOREIGN KEY (eventID) REFERENCES event(eventID),
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID),
ADD FOREIGN KEY (crewID) REFERENCES crew(crewID),
ADD FOREIGN KEY (documentCategoryID) REFERENCES documentCategory(documentCategoryID);

ALTER TABLE riderElement
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID) ON DELETE CASCADE,
ADD FOREIGN KEY (eventID) REFERENCES event(eventID) ON DELETE CASCADE;

ALTER TABLE bug ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID);


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
