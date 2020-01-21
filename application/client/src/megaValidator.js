/**
 * Megavalidator is a validator class that is used for validating form inputs across the application.
 *
 * **/
export class MegaValidator {


    static validateUsernameLength(newUsername){
        if(newUsername===undefined) return true;
        return newUsername.length > 1;
    }

    static validateUsername(oldUsername, newUsername) {
        let illegalCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (illegalCharacters.test(newUsername)) {
            return false;
        } else {
            return this.validateUsernameLength(newUsername) && oldUsername !== newUsername;
        }
    }

    static validatePhoneNumberLength(phoneNumber) {
        return (phoneNumber.length === 8)
    }

    static checkForEInNumber(number) {
        let pattern = new RegExp("e");
        return (pattern.test(number));
    }

    static validatePhoneNumber(phoneNumber, newPhoneNumber) {
        return (newPhoneNumber !== phoneNumber) && this.validatePhoneNumberLength(newPhoneNumber) && !this.checkForEInNumber(newPhoneNumber)
    }

    static validatePasswordLength(firstPassword, secondPassword){
        return firstPassword.length >= 8 || secondPassword.length >=8;
    }

    static validatePassword(oldPassword, firstNewPassword, secondNewPassword) {
        return (firstNewPassword === secondNewPassword) && (firstNewPassword.length > 0) && (firstNewPassword !== oldPassword) && this.validatePasswordLength(firstNewPassword, secondNewPassword);
    }

    static validateEmailLength(firstEmail, secondEmail){
        return firstEmail.length >= 3 || secondEmail.length >= 3;
    }

    static validateEmail(firstEmail, secondEmail){
        return firstEmail === secondEmail && this.validateEmailLength(firstEmail,secondEmail);
    }

    static validateFile(file) {
        if(file===undefined){
            return false;
        }
        return (/\.(gif|jpeg|jpg|png)$/i).test(file.name);

    }
}