import React from 'react';
import {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Menu, NavBar, UserProfileButton} from "./components/menu/navigation";
import {Content} from "./components/content/content";
import {HashRouter, NavLink, Route} from 'react-router-dom';
import {AddPerformer, Performers} from "./components/content/performers";
import {Dashboard} from "./components/content/dashboard/dashboard";
import {LoginForm} from "./components/login/loginForm";
import {RegisterForm} from "./components/login/registerForm";
import {CreateEventSplash} from "./components/content/CreateEventSplash";
import {UserPage} from "./components/user/userPage";
import {Search, SearchPeople} from "./components/content/searchPerson";

import {GetTicket} from "./components/ticket";
import {EventForm} from "./components/content/eventForm";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FaCalendarAlt, FaCalendarPlus, FaFileSignature, FaMusic, FaUsers} from "react-icons/all";


export class App extends Component{

    constructor(props) {
        super(props);

        this.state = {
            loggedIn : true,
            mobileView : false,
        }

        window.addEventListener('resize', () =>{
            if(window.innerWidth > 900){
                let currentState = this.state;
                currentState.mobileView = false;
                this.setState(currentState);
            } else{
                let currentState = this.state;
                currentState.mobileView = true;
                this.setState(currentState);
            }

        });
    }

    render(){

        if(!this.state.loggedIn){
            return(
                <div className="Login-Container">
                    <HashRouter>
                        <Route exact path="/" component={() => <LoginForm logIn={() => this.handleLogin()}/>} />
                        <Route exact path="/registrer" component={() => <RegisterForm />} />
                    </HashRouter>
                </div>
            )
        } else {
              return (
                <div className="App">
                    <HashRouter>
                        <div className="row no-gutters">
                            <div className="col-md-2 col-12">
                                {!this.state.mobileView?<NavBar />:<MobileMenu/>}
                                {this.state.mobileView?
                                    <div className="margin-bottom-30"><br/> </div>:null
                                }
                            </div>

                            <div className="col-lg-10">
                                <Route exact path="/" component={() => <Content page={<Dashboard/>} />} />
                                <Route exact path="/opprett"  component={() => <Content page={<CreateEventSplash/>} />} />
                                <Route exact path="/artister" component={() => <Content page={<SearchPeople/>} />} />
                                <Route exact path="/personell" component={Content}/>
                                <Route exact path="/kontrakter" component={Content}/>
                                <Route exact path="/opprett"  component={() => <Content page={<CreateEventSplash/>} />} />
                                <Route exact path="/brukerprofil"  component={() => <Content page={<UserPage/>} />} />
                                <Route exact path="/arrangementEdit"  component={() => <Content page={<EventForm/>} />} />

                            </div>
                        </div>
                    </HashRouter>
                </div>
              );
        }
    }

    handleLogin(){
        this.setState({loggedIn: true,});
    }


}

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
                            <UserProfileButton/>
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </div>

        )
    }
}

export default App;
