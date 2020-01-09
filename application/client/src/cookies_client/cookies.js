import axios from 'axios';

class CookieSystem{

    checkToken(username){
        let header = {
            'x-access-token': localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
        };

        let body = {
            'username': username
        };

        return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.json()).then(res => {
                let token = res.jwt;
                localStorage.setItem('access-token', token);
            }
        ).catch(error => {
            console.log('Error: ' + error);
        });
    }

}