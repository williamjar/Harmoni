import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';
import {FaCalendarAlt} from "react-icons/all";
import {FaCalendarPlus} from "react-icons/all";
import {FaMusic} from "react-icons/all";
import {FaUsers} from "react-icons/all";
import {FaFileSignature} from "react-icons/all";

import harmoniLogo from './Logo_large.png'
import mobileLogo2 from './Logo_mobile.png'
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {FaSignOutAlt} from "react-icons/all";

import {FaBars} from "react-icons/all";
import {FaUserCog} from "react-icons/all";
import {FaBullhorn} from "react-icons/all";
import { createHashHistory } from 'history';
import {PictureService} from "../../store/pictureService";
let history = createHashHistory();

let fontSize = 100;

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
                        <div className="logoImg-mobile icon-hover" >
                            <NavLink to="/" onClick={this.collapse}>
                                <img width="100px" src={mobileLogo2} alt=""/>
                            </NavLink>
                        </div>
                    </div>

                    <div className="col-5 text-right mmi-mobile">
                        <MMI/>
                    </div>
                    <div className="col-3 padding-30  padding-right-20 text-right">

                        <FaUserCog size="30" onClick={this.goToUserProfile} className="pointer icon-hover"/>

                        <FaBars size="30" onClick={this.toggleExpand} className="pointer margin-left-30 icon-hover"/>

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

export class NavBar extends Component {
    render() {
        return (
            <div className="Nav-Menu card">
                <div className="logoImg">
                    <img src={harmoniLogo} alt=""/>
                </div>

                <div className="padding-top-20 mmi">
                <MMI/>
                </div>
                <Menu/>



                <UserProfileButton profilePicture={this.props.profilePicture}/>

                <div className="center font-italic purple log-out" onClick={() => {
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
        )
    }
}

export class MMI extends Component{
    render() {
        return(
            <div className="text-right">
                <span onClick={this.decreaseFont} className="pointer letter-mmi">
                    a
                </span>
                <span onClick={this.increaseFont} className="pointer letter-mmi">
                    A
                </span>


            </div>
        )
    }


    decreaseFont = () => {
        let body = document.body;
        if(fontSize>85){
            body.style.fontSize = `${fontSize -= 15}%`;
        }


    };

    increaseFont = () => {
        let body = document.body;
        if(fontSize <160){
            body.style.fontSize = `${fontSize += 15}%`;
            console.log(fontSize);
        }
    };
}

export class Menu extends Component{
    render() {
        return(
            <ul className="nav nav-links text-left list-group-flush w-100 ">

                <div className="w-100">
                    <NavLink className="text-decoration-none  nav-link" to="/" exact={true}>
                    <li className="">
                        <span className="menu-item"> <FaCalendarAlt/><span className="padding-left-20"> Mine arrangement</span></span>
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none nav-link" to="/opprett">
                    <li className="">
                        <span className="menu-item"> <FaCalendarPlus/><span className="padding-left-20"> Opprett arrangement</span></span>
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none nav-link" to="/artister">
                    <li className="">
                        <span className="menu-item"> <FaMusic/><span className="padding-left-20"> Mine artister</span></span>
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none nav-link" to="/personell">
                    <li className="">
                        <span className="menu-item"> <FaUsers/><span className="padding-left-20"> Mitt personell</span></span>
                    </li>
                    </NavLink>

                    <NavLink className="text-decoration-none nav-link" to="/dokumenter">
                    <li className="">
                        <span className="menu-item"><FaFileSignature/><span className="padding-left-20"> Mine dokumenter</span></span>
                    </li>
                    </NavLink>
                    <NavLink className="text-decoration-none nav-link" to="/bug">
                        <li className="">
                            <span className="menu-item"><FaBullhorn/><span className="padding-left-20"> Rapporter feil</span></span>
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
            link: '',
            profilePicture: ''
        };
    }

    componentDidMount() {
        this.updateInfo((profilePicture) => {
            if (profilePicture !== null && profilePicture !== '') {
                PictureService.previewPicture(profilePicture, (url) => {
                    this.setState({link: url});
                });
            }
        })
    }

    upload = (path) => {
        PictureService.previewPicture(path, (url) => {
            this.setState({link: url});
        });

    };

    checkForUpdate(){
        if(this.state.profilePicture !== this.props.profilePicture){
            this.upload(this.props.profilePicture);
            this.setState({profilePicture: this.props.profilePicture})
        }else{
            if(this.state.link !== ''){
                return(<img width={50} src = {this.state.link} alt={"Bildet kunne ikke lastes inn"}/>);
            } else {
                return(<img width={50} src={require('../user/profile.png')} alt={"standard profilbilde"}/>);
            }

        }
    }

    render() {
        return(
            <NavLink to="/brukerprofil" className={""}>
                <div className="user-nav">
                    <Row className = {" no-gutters"}>
                        <Col size = {2} className={"text-center text-indent-20"}>
                            {this.checkForUpdate()}
                        </Col>
                        <Col size = {10} className={"padding-top-5 main-color"}>
                            <b>{this.state.username}</b>
                            <br/>
                            Arrangør
                        </Col>
                    </Row>
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
                }));
                callback(databaseImage);
            }
        });
    }
}

