drop table bug;

drop table document;

drop table documentCategory;

drop table event_artist;

drop table event_crewCategory_crew;

drop table crew;

drop table crewCategory;

drop table riderElement;

drop table artist;

drop table genre;

drop table ticketType;

drop table event;

drop table eventType;

drop table organizer;

drop table contact;

drop table picture;

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
    isResponsible TINYINT(1) DEFAULT 0,
    PRIMARY KEY(eventID, crewCategoryID, crewID)
);

CREATE TABLE document(
    documentID INT AUTO_INCREMENT,
    eventID INT,
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
ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID),
ADD FOREIGN KEY (eventTypeID) REFERENCES eventType(eventTypeID),
ADD FOREIGN KEY (pictureID) REFERENCES picture(pictureID);

ALTER TABLE organizer
ADD FOREIGN KEY (pictureID) REFERENCES picture(pictureID),
ADD FOREIGN KEY (contactID) REFERENCES contact(contactID);

ALTER TABLE ticketType ADD FOREIGN KEY (eventID) REFERENCES event(eventID);

ALTER TABLE artist
ADD FOREIGN KEY (genreID) REFERENCES genre(genreID),
ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID),
ADD FOREIGN KEY (contactID) REFERENCES contact(contactID) ON DELETE CASCADE;

ALTER TABLE event_artist
ADD FOREIGN KEY (eventID) REFERENCES event(eventID),
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID) ON DELETE CASCADE;

ALTER TABLE crew ADD FOREIGN KEY (contactID) REFERENCES contact(contactID) ON DELETE CASCADE;

ALTER TABLE crewCategory ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID);

ALTER TABLE event_crewCategory_crew
ADD FOREIGN KEY (eventID) REFERENCES event(eventID),
ADD FOREIGN KEY (crewCategoryID) REFERENCES crewCategory(crewCategoryID),
ADD FOREIGN KEY (crewID) REFERENCES crew(crewID) ON DELETE CASCADE;

ALTER TABLE document
ADD FOREIGN KEY (eventID) REFERENCES event(eventID),
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID),
ADD FOREIGN KEY (crewID) REFERENCES crew(crewID),
ADD FOREIGN KEY (documentCategoryID) REFERENCES documentCategory(documentCategoryID);

ALTER TABLE riderElement
ADD FOREIGN KEY (artistID) REFERENCES artist(artistID),
ADD FOREIGN KEY (eventID) REFERENCES event(eventID);

ALTER TABLE bug ADD FOREIGN KEY (organizerID) REFERENCES organizer(organizerID);

