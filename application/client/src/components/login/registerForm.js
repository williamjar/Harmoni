import React from 'react';
import {Form, Button, Card, Row, Col} from 'react-bootstrap'
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import { createHashHistory } from 'history';

let history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            firstEmail: '',
            secondEmail: '',
            firstPassword : '',
            secondPassword: '',
            phonenumber: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(name + " verdi: " + value);

        this.setState({[name]: value,});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    // Functions to verify the contents in the form.

    validatePasswordLength(){
        return this.state.firstPassword.length >= 8 || this.state.secondPassword.length >=8;
    }

    validateEmailLength(){
        return this.state.firstEmail.length >= 3 || this.state.secondEmail.length >= 3;
    }

    validatePassword(){
        return (this.state.firstPassword === this.state.secondPassword);
    }

    validateEmail(){
        return this.state.firstEmail === this.state.secondEmail;
    }

    validateUsernameLength(){
        return this.state.username.length >= 2;
    }
    validateUsername(){
        let  illegalCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        return !(illegalCharacters.test(this.state.username));
    }

    validateForm() {
        return (this.validateEmail() && (this.validatePassword())) && (this.validatePasswordLength()) && (this.validateUsername()) && (this.validateEmailLength()) && this.validatePasswordLength();
    }

    render() {

        return (
            <Card>
                <div className="card-header"><h2 className="card-title text-center">Registrer ny bruker</h2></div>

                <div className="justify-content-md-center m-5">
                    <Form onSubmit={this.handleSubmit}>

                        <Form.Group>
                            <Form.Control maxLength="25" type="text" name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control maxLength="8" type="number" name="phonenumber" placeholder="Telefonnummer" value={this.state.phonenumvber} onChange={this.handleInputChange}/>
                        </Form.Group>


                            <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control type="email" maxLength="320" name="firstEmail" placeholder="E-postadresse" value={this.state.firstEmail} onChange={this.handleInputChange}/>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Control type="email" maxLength="320" name="secondEmail" placeholder="Gjenta e-postadresse" value={this.state.secondEmail} onChange={this.handleInputChange}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Control type="password" maxLength="40" name="firstPassword" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group>
                                    <Form.Control type="password" maxLength="30" name="secondPassword" placeholder="Gjenta passord" value={this.state.password} onChange={this.handleInputChange}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button variant="btn btn-primary" type="submit" disabled={!this.validateForm()}> Registrer bruker </Button>


                        <Form.Text className="text-danger" hidden={this.validateUsername()}>Brukernavnet kan kun inneholde tall og bokstaver</Form.Text>
                        <Form.Text className="text-danger" hidden={this.validateUsernameLength()}>Brukernavn kreves</Form.Text>

                        <Form.Text className="text-danger" hidden={this.validateEmail()}>E-postadressene må være like</Form.Text>
                        <Form.Text className="text-danger" hidden={this.validateEmailLength()}>E-postaddresse kreves</Form.Text>

                        <Form.Text className="text-danger" hidden={this.validatePassword()}>Passordene må være like</Form.Text>
                        <Form.Text className="text-danger" hidden={this.validatePasswordLength()}>Passordet ditt må være på minst 8 tegn</Form.Text>

                        <Form.Text className="text-danger" hidden={!this.databaseAlreadyRegistered()}>Det er allerede registrert en bruker med denne e-postaddressen</Form.Text>
                        <Form.Text className="text-danger" hidden={!this.databaseUsernameAlreadyExists()}>Brukernavnet finnes allerede</Form.Text>
                        <Form.Text className="text-danger" hidden={!this.databaseConnectionError()}>Det oppstod en feil med oppkoblingen til databasen.</Form.Text>

                    </Form>
                </div>
            </Card>
        )
    }


    submitForm(){
        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.firstEmail" and "this.state.firstPassword";
        *   It can be assumed that the emails are identical and that the passwords are identical.
        *
        * */
        RegisterOrganizerService.registerOrganizer(this.state.username, this.state.firstEmail, this.state.firstPassword, statusCode => {
            if (statusCode === 200){
                console.log("User perfectly registered");
                history.push('/');
            }
            else if (statusCode === 501){
                console.log("email already registered");
            }
            else if (statusCode === 502){
                console.log("name already registered");
            }
            else if (statusCode === 500){
                console.log("database error, please try again");
            }
        });
    }

    // Database control functions to display the proper error message to the user.

    databaseAlreadyRegistered(){
        return false;
        /*
         * return true if the user is already registered.
         */
    }

    databaseUsernameAlreadyExists(){
        return false;
        /*
         * return true if the user is already registered.
         */
    }


    databaseConnectionError() {
        return false;
        /*
         * return true if there is a database connection error
         */
    }




}