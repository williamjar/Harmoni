import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import {FaCalendarAlt} from "react-icons/all";
import {FaCalendarPlus} from "react-icons/all";
import {FaMusic} from "react-icons/all";
import {FaUsers} from "react-icons/all";
import {FaFileSignature} from "react-icons/all";
import logo from './logo.jpeg';


export class NavBar extends Component{
    render(){
        return(
            <div className="Nav-Menu card">
                <div className="logoImg">
                <img width={"300px"} src={logo} alt="logo image"/>
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
            <div className="nav-links">

                <div className="nav flex-column nav-pills" id="" role="tablist"
                     aria-orientation="vertical">

                    <NavLink className="nav-link" to="/" exact={true}>
                        <FaCalendarAlt/> Dine arrangement
                    </NavLink>

                    <NavLink className="nav-link" to="/opprett">
                        <FaCalendarPlus/> Opprett arrangement
                    </NavLink>

                    <NavLink className="nav-link" to="/artister">
                        <FaMusic/> Artister
                    </NavLink>

                    <NavLink className="nav-link" to="/personell">
                        <FaUsers/> Personell
                    </NavLink>

                    <NavLink className="nav-link" to="/kontrakter">
                        <FaFileSignature/> Kontrakter
                    </NavLink>
                </div>

            </div>
        )
    }
}

export class UserProfileButton extends Component{
    render() {
        return(
            <NavLink to="/brukerprofil">
                <div className="user-nav">
                    <div className="row">
                        <div className="col-3">
                            <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50} alt=""/>
                        </div>
                        <div className="col-9">
                            <b>Navn Navnesen</b><br/>
                            Arrangør
                        </div>
                    </div>
                </div>
            </NavLink>
        )
    }
}