import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginForm} from "../login/loginForm";
import {RegisterForm} from "../login/registerForm";
import {UserPage} from "../user/userPage";



export class Content extends Component{
    render(){
        return(
            <div className="content">
                <UserPage/>
                <div className="card">
                    <div className="card-body">
                {this.props.page}
                    </div>
                </div>
            </div>
        )
    }
}

