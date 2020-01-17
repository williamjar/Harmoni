import {Contact} from "../../classes/contact";

test('Contact constructor name', () => {
    expect(Contact.getTestContacts()[0].contactName).toBe('organizer One');
});

test('Contact constructor phone', () =>{
    expect(Contact.getTestContacts()[0].phone).toBe('00 00 12 34');
});

test('Contact constructor email', () => {
    expect(Contact.getTestContacts()[1].email).toBe('nummeren@artist.no');
});

test('Contact email is null', () => {
    expect(Contact.getTestContacts()[2].email).toBe(null);
});
