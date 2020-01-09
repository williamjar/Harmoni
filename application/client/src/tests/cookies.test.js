import {Login} from "../cookies_client/loginAxios";
import {CookieSystem} from "../cookies_client/cookies";


test('Check that a user is registered with a valid token', () => {
    Login.loginOrganizer('LilleLondon', 'salted/hashed passord').then(() => {
        console.log(localStorage.getItem('organizerID'));
        expect(localStorage.getItem('organizerID')).not.toBe(null);

        CookieSystem.checkToken(localStorage.getItem('access-token'));
        console.log(localStorage.getItem('access-token'));
        expect(localStorage.getItem('access-token')).not.toBe(null);
    });
});

test('Check that user is not registered with a valid token', () => {
    Login.loginOrganizer('Unregistered', 'Unregistered').then(() => {
        expect(localStorage.getItem('organizerID')).toBe(null);
        expect(localStorage.getItem('access-token')).toBe(null);
    })
});