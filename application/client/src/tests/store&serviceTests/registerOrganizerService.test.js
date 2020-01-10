import {RegisterOrganizerService} from "../../service&store/registerOrganizerService";

test('Can we add an organizer?', () => {
    function successCallback(insertID){
        expect(insertID).toBeBiggerThan(2);
    }
    function errorCallback(){
        expect(1).toBe(2);
    }
    RegisterOrganizerService.registerOrganizer("some@email.com", "somepassword", successCallback, errorCallback)
});