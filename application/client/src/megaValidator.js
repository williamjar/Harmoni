/**
 * Megavalidator is a validator class that is used for validating form inputs across the application.
 *
 * **/
export class MegaValidator {


    static validateUsernameLength(newUsername){
        if(newUsername===undefined) return true;
        return newUsername.length > 0;
    }

    static validateUsername(oldUsername, newUsername) {
        let illegalCharacters = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
        if (illegalCharacters.test(newUsername)) {
            return false;
        } else {
            return this.validateUsernameLength(newUsername) && oldUsername !== newUsername;
        }
    }

    static validatePhoneNumberLength(phoneNumber) {
        if(phoneNumber===null || phoneNumber===undefined) return true;
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

        if(firstEmail===null || secondEmail===null) return false;

        return firstEmail.length >= 2 && secondEmail.length >= 2;
    }

    static validateEmail(firstEmail, secondEmail){
        return firstEmail === secondEmail && this.validateEmailLength(firstEmail,secondEmail);
    }

    static validateFile(file) {
        if(file===undefined || file === null){
            return false;
        }
        if (file.name){
            return (/\.(jpeg|jpg|png)$/i).test(file.name);
        }
        else{
            return (/\.(jpeg|jpg|png)$/i).test(file)
        }
    }
}