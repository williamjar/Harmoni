import React, {Component} from 'react';
import {Row, Col, Card} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import {FaCalendarAlt} from "react-icons/all";
import {FaCalendarPlus} from "react-icons/all";
import {FaMusic} from "react-icons/all";
import {FaUsers} from "react-icons/all";
import {FaFileSignature} from "react-icons/all";

import harmoniLogo from './Logo_large.png'
import mobileLogo2 from './Logo_mobile.png'
import fullLogo from './harmonilogofull.png'
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {FaSignOutAlt} from "react-icons/all";

import {FaBars} from "react-icons/all";
import {FaUserCog} from "react-icons/all";
import {FaBullhorn} from "react-icons/all";
import { createHashHistory } from 'history';
import {PictureService} from "../../store/pictureService";
let history = createHashHistory();

export class MobileMenu extends Component{

    constructor(props){
        super(props);

        this.state = {
            expand : false
        }
    }

    render() {
        return(
            <div className="zoom-80 fixed-top card">
                <div className="row no-gutters">
                    <div className="col-4">
                        <div className="logoImg-mobile" >
                            <NavLink to="/" onClick={this.collapse}>
                                <img width="100px" src={mobileLogo2} alt=""/>
                            </NavLink>
                        </div>
                    </div>

                    <div className="col-8 text-right padding-20  padding-right-20 align-content-center">
                        <FaUserCog size="30" onClick={this.goToUserProfile} className="pointer"/>
                        <FaBars size="30" onClick={this.toggleExpand} className="pointer margin-left-30"/>
                    </div>
                </div>
                {this.state.expand?
                    <div className="card drop-shadow-mobile-menu " onClick={this.toggleExpand}>
                        <Menu/>


                        <div className="log-out-mobile pointer" onClick={() => {
                            sessionStorage.setItem('token', null);
                            sessionStorage.setItem('currentEvent', null);
                            sessionStorage.removeItem('loggedIn');
                            CookieStore.setCurrentToken(null);
                            CookieStore.setCurrentUserID(-1);
                            history.push("/");
                            this.props.logOut();
                        }}>
                            Logg av <FaSignOutAlt size={20}/>
                        </div>


                    </div>



                    :null}
            </div>

        )
    }

    collapse = () => {
        this.setState({expand : false});
    };

    toggleExpand = () => {
        this.setState({expand : !this.state.expand});
    };

    goToUserProfile = () => {
        history.push("/brukerprofil");
        this.collapse();
    };

}

export class NavBar extends Component{
    render(){
        return(
            <div className="Nav-Menu card">
                <div className="logoImg">
                <img src={harmoniLogo} alt=""/>
                </div>

                <Menu/>

                <UserProfileButton/>

                <div className="center font-italic purple log-out" onClick={() => {
                    sessionStorage.setItem('token', null);
                    sessionStorage.removeItem('loggedIn');
                    CookieStore.setCurrentToken(null);
                    CookieStore.setCurrentUserID(-1);
                    history.push("/");
                    this.props.logOut();
                }}>
                    Logg av <FaSignOutAlt size={20}/>
                </div>

            </div>
        )
    }
}

export class Menu extends Component{
    render() {
        return(
            <ul className="nav nav-links text-left list-group-flush w-100 ">

                <div className="w-100">
                    <NavLink className="text-decoration-none list-group-item nav-link" to="/" exact={true}>
                    <li className="">
                        <FaCalendarAlt/> Mine arrangement
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none list-group-item nav-link" to="/opprett">
                    <li className="">
                        <FaCalendarPlus/> Opprett arrangement
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none list-group-item nav-link" to="/artister">
                    <li className="">
                        <FaMusic/> Mine artister
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none list-group-item nav-link" to="/personell">
                    <li className="">
                        <FaUsers/> Mitt personell
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none list-group-item nav-link" to="/dokumenter">
                    <li className="">
                        <FaFileSignature/> Mine dokumenter
                    </li>
                    </NavLink>
                    <NavLink className="text-decoration-none list-group-item nav-link" to="/bug">
                        <li className="">
                            <FaBullhorn/> Rapporter feil
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
            username: '',
            profilePicture: '',
            link: ''
        };
    }

    componentDidMount() {
        this.updateInfo((profilePicture) => {
            if(profilePicture !== null && profilePicture !== ''){
                PictureService.previewPicture(profilePicture, (url) => {
                    this.setState({link: url})
                });
            }
        })
    }

    checkIfUserHasPicture(){
        if(this.state.profilePicture !== null && this.state.profilePicture !== ''){
            return(<img width={50} src = {this.state.link} alt={"Bildet kunne ikke lastes inn"}/>);
        }else {
            return(<img width={50} src={require('../user/profile.png')} alt={"test"}/>);
        }
    }


    render() {
        return(
            <NavLink to="/brukerprofil">
                <div className="user-nav">
                    <div className="row no-gutters">
                        {this.checkIfUserHasPicture()}
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

    updateInfo(callback){
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200){
                let databaseUsername = OrganizerStore.currentOrganizer.username;
                let databaseImage = OrganizerStore.currentOrganizer.pictureLink;


                this.setState(this.setState({
                    username: databaseUsername,
                    profilePicture: databaseImage
                }));
                callback(databaseImage);
            }
        });
    }
}

