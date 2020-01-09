import {Event} from "../../classes/event";

test('Check lengths of event arrays (crew categories, riders and artists)', () => {
   expect(Event.getTestEvents()[0].artists.length).toBe(2);
   expect(Event.getTestEvents()[0].crewCategories.length).toBe(2);
   expect(Event.getTestEvents()[0].riderElements.length).toBe(2);
});

test('Check rider per artist', () => {
   expect(Event.getTestEvents()[0].getRiderFromArtist(Event.getTestEvents()[0].artists[0]).length).toBe(1);
   expect(Event.getTestEvents()[0].getRiderFromArtist(Event.getTestEvents()[0].artists[1]).length).toBe(1);
});