import React from 'react';
import {Form, Button, Card, Spinner} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import {LoginService} from "../../store/loginService";
import {CookieStore} from "../../store/cookieStore";
import {UserPage} from "../user/userPage";

export class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            loginError : false,
            serverError: false,
            loggingIn: false
        };


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }


    handleInputChange(event){
        this.setState({serverError: false});
        this.setState({loginError: false});
        this.setState({loggingIn: false});
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value,});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    // Form validation functions

    validateForm() {
        return ((this.state.email.length > 0) && (this.state.password.length > 0));
    }

    render(){
        return (

            <Card style={{width : '25rem'}} className="text-center mx-auto mt-5">
                <Form onSubmit={this.handleSubmit} className={"align-items-center"}>
                <Card.Body>
                    <Card.Title className="mb-4">Logg inn</Card.Title>
                            <Form.Group>
                                <Form.Control type="email" name="email" placeholder="E-postadresse" value={this.state.email} onChange={this.handleInputChange}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                            </Form.Group>




                            <Form.Text className="text-danger" hidden={!this.state.loginError}>Feil brukernavn eller passord.</Form.Text>
                            <Form.Text className="text-danger" hidden={!this.state.serverError}>Feil med oppkoblingen, prøv igjen senere.</Form.Text>

                            <Form.Text> Ny bruker? <NavLink to="/registrer"> Klikk <span className="NavLink">
                                her for registrere deg
                            </span></NavLink></Form.Text>


                </Card.Body>
                <Card>
                        <Button variant="btn btn-primary" type="submit" hidden={this.state.loggingIn} disabled={!this.validateForm()}> Logg inn</Button>
                        <Button variant="btn btn-primary" disabled hidden={!this.state.loggingIn}><Spinner as="span" animation="border" size="sm" aria-hidden="true"/> Logger inn</Button>
                </Card>
            </Form>
            </Card>

        )
    }

    submitForm() {
        //The callback has to run in different places in the loginOrganizer() method to make sure synchronicity is complete
        this.dataBaseLogin();
    }

    dataBaseLogin(){
        this.setState({loggingIn: true});

        LoginService.loginOrganizer(this.state.email, this.state.password, status => {
            console.log(status);
            if (status===200) {
                sessionStorage.setItem('loggedIn', 'true');
                this.props.logIn();
                this.setState({loggingIn: false});
            } else if(status===501){
                this.setState({loggingIn: false});
                this.setState({loginError: true});
            } else {
                this.setState({loggingIn: false});
                this.setState({serverError: true});
            }

        });


    }

    // Database control functions to display the proper error message to the user.

}