import axios from "axios";

export class Login{
    static loginOrganizer(username, hashedSaltedPassword){

        let header = {
            "Content-Type": "application/json"
        };

        let body = {
            "username": username,
            "password": hashedSaltedPassword
        };

        return axios.post("http://localhost/login", JSON.stringify(body), {headers: header}).then(res => res.json())
            .then(loginResponse => {
                console.log(loginResponse);
                axios.get("http://localhost:8080/api/organizer_id/" + username).then(IDResponse => {
                    console.log(IDResponse);
                    if (IDResponse.status === 200){
                        localStorage.setItem('organizerID', IDResponse.data[0].organizerID);
                        localStorage.setItem('access-token', loginResponse.jwt)
                    }
                })
            });
    }
}