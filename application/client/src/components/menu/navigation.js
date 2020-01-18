import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import {FaCalendarAlt} from "react-icons/all";
import {FaCalendarPlus} from "react-icons/all";
import {FaMusic} from "react-icons/all";
import {FaUsers} from "react-icons/all";
import {FaFileSignature} from "react-icons/all";
import logo from './logo.jpeg';
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import Navbar from "react-bootstrap/Navbar";


export class MobileMenu extends Component{
    render() {
        return(
            <div className="fixed-top card">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/">Harmoni</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <div className="padding-top-20 nav-links">
                            <Menu/>
                        </div>
                        <div className="user-nav-mobile">
                        <UserProfileButton/>
                        </div>

                    </Navbar.Collapse>
                </Navbar>
            </div>

        )
    }
}

export class NavBar extends Component{
    render(){
        return(
            <div className="Nav-Menu card">
                <div className="logoImg">
                <img width={"300px"} src={logo} alt=""/>
                </div>

                <Menu/>
                <UserProfileButton/>

            </div>
        )
    }
}

export class Menu extends Component{
    render() {
        return(
            <ul className="nav nav-links text-left list-group-flush w-100 ">

                <div className="w-100">
                    <NavLink className="" to="/" exact={true}>
                    <li className="list-group-item nav-link">
                        <FaCalendarAlt/> Mine arrangement
                    </li>
                    </NavLink>

                    <NavLink className="" to="/opprett">
                    <li className="list-group-item nav-link">
                        <FaCalendarPlus/> Opprett arrangement
                    </li>
                    </NavLink>

                    <NavLink className="" to="/artister">
                    <li className="list-group-item nav-link">
                        <FaMusic/> Artister
                    </li>
                    </NavLink>

                    <NavLink className="" to="/personell">
                    <li className="list-group-item nav-link">
                        <FaUsers/> Personell
                    </li>
                    </NavLink>

                    <NavLink className="" to="/dokumenter">
                    <li className="list-group-item nav-link">
                        <FaFileSignature/> Mine dokumenter
                    </li>
                    </NavLink>
                </div>

            </ul>
        )
    }
}


export class UserProfileButton extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        this.updateInfo();
    }

    render() {
        return(
            <NavLink to="/brukerprofil">
                <div className="user-nav">
                    <div className="row no-gutters">
                        <div className="col-lg-3">
                            <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50} alt=""/>
                        </div>
                        <div className="col-lg-9">
                            <div className="padding-left-15">
                                <b>{this.state.username}</b><br/>
                                Arrangør
                            </div>
                        </div>
                    </div>
                </div>
            </NavLink>
        )
    }

    updateInfo(){
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200){
                var databaseUsername = OrganizerStore.currentOrganizer.username;
                this.setState(this.setState({
                    username: databaseUsername
                }));
            }
        });
    }
}

