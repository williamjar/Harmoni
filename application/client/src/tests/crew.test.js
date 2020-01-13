import runSQLFile from '../../../runsqlfile';
import {CrewService} from "../service&store/crewService.js";
import {CrewMember} from "../classes/crewMember";
import {ArtistService} from "../service&store/artistService";

let mysql = require("mysql");

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let privatePool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql-ait.stud.idi.ntnu.no",
    user: "evengu",
    password: "O7KhlwWQ",
    database: "evengu",
    debug: false,
    multipleStatements: true
});

beforeAll(done => {
    console.log("Hello world!");
    runSQLFile("../create.sql", pool, () => {
        runSQLFile("../testData.sql", pool, done);
    });
});


test('Check that right crew member can be pulled from database', () => {
    let expected = new CrewMember(1,'Svein', '+4793939393', 'kontakt@rigging.no', 'Ledig hver hvelg');
    let actual = CrewService.getCrewMember(1);
    expect(actual).toBe(expected);
});

test('Check that right crew members for organizer can be pulled from database', () =>{

  // CrewService.getAllCrewMembersForOrganizer(1);
});

test('Check that the correct crew categories for organizer can be pulled from database', () =>{
    //CrewService.getAllCrewCategoriesForOrganizer(1);
});

test('Check that right crew members for an event can be pulled from database', () =>{
    //CrewService.getAllCrewMembersForEvent();
});

test('Check that a crew member can be registered', () =>{
    CrewService.createCrewMember("Navn Navnesen","+4812312123","navn@gmail.com",'Lukter vondt',1);
    let expected = new CrewMember("Navn Navnesen","+4812312123","navn@gmail.com");
    expect(expected).toBe(CrewService.getCrewMember(3));
})

test('Check that it is possible for an organizer to add a crew category', () =>{
    //CrewService.addCategory("Bandmedlem","1");

})

test('Check that it is possible to assign a crew member to an event', () =>{
   //  CrewServise.assignCrewMemberToEvent(eventID, categoryID, crewID, isResponsible)
})

test('Check that it is possible to add a document to a crew member', () =>{
    //CrewService.addDocumentToCrewMember(eventID, name, link, crewID, categoryID);
})

test('Check that it is possible to update a crew member', () =>{
    // CrewService.updateCrewMember(description, id);
})

test('Check that it is possible to update a crew member as a leader', () =>{
    //let actual = CrewService.updateCrewMemberAsLeader(isResponsible, eventID, categoryID, crewID);
})

test('Check that the right crew member is deleted', () =>{
    let response = CrewService.deleteCrewMember(3);
    let affectedRows = response.data[0].affectedRows;
    expect(affectedRows).toBe(1);
})

test('Check that the right crew category is deleted', () =>{
    // CrewService.deleteCrewCategory();
})

test('Check that a crew member can be unassigned', () =>{
    //CrewService.unassignCrewMember();
})






deleteCrewMember(crewID)

deleteCrewCategory(crewCategoryID)

unassignCrewMember(crewCategoryID, crewID)

