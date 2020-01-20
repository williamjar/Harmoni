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
import {getCurrentUserID} from "../../store/cookieStore";


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
                    <Row>
                        <Col>
                        <div>
                            <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50} alt=""/>
                        </div>
                        </Col>
                        <Col>
                            <div>
                                <b>{this.state.username}</b><br/>
                                Arrangør

                            </div>
                        </Col>
                        <Col/>
                        <Col/>
                    </Row>
                </div>
            </NavLink>
        )
    }

    updateInfo(){
        OrganizerStore.getOrganizer(getCurrentUserID(), statusCode => {
            if (statusCode === 200){
                var databaseUsername = OrganizerStore.currentOrganizer.username;
                this.setState(this.setState({
                    username: databaseUsername
                }));
            }
        });
    }
}

