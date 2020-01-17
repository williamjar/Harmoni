import {CrewMember} from "../../classes/crewMember";

test('Crewmember constructor description', () => {
    expect(CrewMember.getTestCrewMember()[0].description).toBe('This lazy dude can only work every third sunday when theres a full moon');
});

test('Crewmember has several categories', () => {
    let crewMember = CrewMember.getTestCrewMember()[0];
    crewMember.addCrewCategory('Not lazy');
    expect(crewMember.crewCategories.length).toBe(2);
    expect(crewMember.crewCategories[0]).toBe('Lazy work');
});

test('Crewmembers first category is \'lazy work\'', () => {
    expect(CrewMember.getTestCrewMember()[0].crewCategories[0]).toBe('Lazy work');
});

