import {Organizer} from "../../classes/organizer";

test('Check lengths of organizer arrays (contacts, events, crewCategories)', () => {
    expect(Organizer.getTestOrganizer()[0].events.length).toBe(0);
    expect(Organizer.getTestOrganizer()[0].contacts.length).toBe(3);
    expect(Organizer.getTestOrganizer()[0].crewCategories.length).toBe(1);
});

test('Password', () => {
    expect(Organizer.getTestOrganizer()[0].checkPassword('admin', null)).toBe(true);
});