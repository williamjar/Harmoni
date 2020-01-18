import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LoginForm} from "../login/loginForm";
import {RegisterForm} from "../login/registerForm";
import {UserPage} from "../user/userPage";
import {Alert} from "../alerts";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";




export class Content extends Component{

    render(){
        return(
            <div className="content">
                <Alert/>
                <div className="card min-height-800 content-container">
                    <div className="card-body">
                {this.props.page}
                    </div>
                </div>
            </div>
        )
    }
}

export class SimpleContent extends Component{
    render() {
        return (
            <div className="card w-50 center simple-content-top">
                {this.props.page}
            </div>

        );
    }
}


