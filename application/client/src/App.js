import React from 'react';
import {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Menu, MobileMenu, NavBar, UserProfileButton} from "./components/menu/navigation";
import {Content, SimpleContent} from "./components/content/content";
import {HashRouter, NavLink, Route} from 'react-router-dom';
import {PerformerCard, PerformersTab} from "./components/content/performers";
import {Dashboard} from "./components/content/dashboard/dashboard";
import {LoginForm} from "./components/login/loginForm";
import {RegisterForm} from "./components/login/registerForm";
import {CreateEventSplash} from "./components/content/CreateEventSplash";
import {UserPage} from "./components/user/userPage";
import {Search} from "./components/content/search";

import {GetTicket} from "./components/ticket";
import {EventForm} from "./components/content/eventForm";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FaCalendarAlt, FaCalendarPlus, FaFileSignature, FaMusic, FaUsers} from "react-icons/all";
import {Alert} from './components/alerts'



import {CookieStore} from "./store/cookieStore";
import { createHashHistory } from 'history';
import {Contracts, MyDocuments, Documents, FolderCategory, FolderEvent} from "./components/contract";
import {BugReview} from "./components/bugReview";


import {Contacts} from "./components/content/contacts/contacts";
let history = createHashHistory();


export class App extends Component{

    constructor(props) {
        super(props);

        this.state = {
            loggedIn : CookieStore.validateToken(),
            mobileView : false,
        };

    }

    turnOffMobileView = () => {
        let currentState = this.state;
        currentState.mobileView = false;
        this.setState(currentState);
    };

    turnOnMobileView = () =>{
        let currentState = this.state;
        currentState.mobileView = true;
        this.setState(currentState);
    };

    componentDidMount = () => {
        window.addEventListener('resize', () =>{
            if(window.innerWidth > 991){
                this.turnOffMobileView();
            } else{
                this.turnOnMobileView();
            }
        });

        if(window.innerWidth > 991){
            this.turnOffMobileView();
        } else{
            this.turnOnMobileView();
        }

        this.handleLogin();
    };

    componentWillUnmount() {
        window.removeEventListener('resize', () => {

        });
    }

    render(){
        if (this.state.loggedIn){
            return (
                <div className="App">
                    <HashRouter>
                        <div className="row no-gutters">

                                {!this.state.mobileView?<div className="col-lg-2"><NavBar /></div>:<div className="col-12"><MobileMenu/></div>}
                                {this.state.mobileView?
                                    <div className="margin-bottom-30"><br/> </div>:null
                                }


                            <div className="col-lg-10 col-sm-12">
                                <Route exact path="/" component={() => <Content page={<Dashboard/>} />} />
                                <Route exact path="/opprett"  component={() => <SimpleContent page={<CreateEventSplash />} />} />
                                <Route exact path="/artister" component={() => <Content page={<Contacts/>} />} />
                                <Route exact path="/personell" component={Content}/>
                                <Route exact path="/dokumenter" component={() => <Content page ={<MyDocuments/>}/>}/>
                                <Route exact path="/dokumenter/:eventID" render={(props) => <Content page ={<FolderCategory{...props} />}/>}/>
                                <Route exact path="/dokumenter/:eventID/:documentCategoryID" render={(props) => <Content page ={<Documents{...props} />}/>}/>
                                <Route exact path="/brukerprofil"  component={() => <Content page={<UserPage/>} />} />
                                <Route exact path="/arrangementEdit"  component={() => <Content page={<EventForm/>} />} />
                                <Route exact path="/arrangementEdit/:id"  component={() => <Content page={<EventForm/>} />} />
                                <Route exact path="/bug" component={() => <Content page={<BugReview/>}/>}/>
                            </div>
                        </div>
                    </HashRouter>
                </div>
            );
        }
        else {
            return(
                <div className="Login-Container">

                    <HashRouter>
                        <Route exact path="/" component={() => <LoginForm logIn={() => this.handleLogin()}/>} />
                        <Route exact path="/registrer" component={() => <RegisterForm />} />
                    </HashRouter>
                </div>
            )
        }
    }

    handleLogin = () => {
        let currentState = this.state;


        let validate = CookieStore.validateToken();

        if (!validate){
            sessionStorage.removeItem('loggedIn');
            history.push("/");
        }
        else{
            sessionStorage.setItem('loggedIn', 'true');
        }

        if (sessionStorage.getItem('loggedIn')){
            currentState.loggedIn = true;
        }
        else{
            currentState.loggedIn = false;
        }

        this.setState(currentState);
    }

}



export default App;
