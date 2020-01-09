import axios from 'axios';

const OrganizerIDDao = require('../../../server/src/dao/organizerIDDao');

export class CookieSystem{

    static checkToken(username){
        let header = {
            'x-access-token': localStorage.getItem('access-token'),
            'Content-Type': 'application/json'
        };

        let body = {
            'username': username
        };

        return axios.post("http://localhost:8080/token", JSON.stringify(body), {headers: header}).then(res => res.json()).then(res => {
                if (res.error){
                    localStorage.setItem('access-token', null);
                    localStorage.setItem('organizerID', null);
                }
                else{
                    let token = res.jwt;
                    localStorage.setItem('access-token', token);
                }
            }
        ).then(() => {
            if (localStorage.getItem('access-token') !== null){
                axios.get("http://localhost:8080/api/organizer_id/" + username).then(response => {
                    if (response.status === 200){
                        localStorage.setItem('organizerID', response.data[0].organizerID);
                    }
                })
            }
        }).catch(error => {
            console.log('Error: ' + error);
        });
    }

}