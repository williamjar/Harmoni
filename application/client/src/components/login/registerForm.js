import React from 'react';
import {Form, Button, Card, Row, Col, Spinner} from 'react-bootstrap'
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import { createHashHistory } from 'history';
import {NavLink} from "react-router-dom";
import {MegaValidator} from "../../megaValidator";

let history = createHashHistory();

export class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            firstEmail: '',
            secondEmail: '',
            firstPassword : '',
            secondPassword: '',
            phonenumber: '',
            usernameAlreadyExist: false,
            emailAlreadyExist: false,
            databaseConnectionError: false,
            loggingIn: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value,});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    // Functions to verify the contents in the form.


    validateForm() {
        return MegaValidator.validateEmail(this.state.firstEmail,this.state.secondEmail) &&
            MegaValidator.validatePassword("nothing", this.state.firstPassword, this.state.secondPassword) &&
            MegaValidator.validateUsername("nothing",this.state.username) &&
            MegaValidator.validateUsernameLength(this.state.username) &&
            MegaValidator.validatePhoneNumberLength(this.state.phonenumber);
    }

    render() {

        return (
            <Card style={{width : '35rem'}} className="text-center mx-auto mt-5">
                <Form onSubmit={this.handleSubmit} className={"align-items-center"}>
                <Card.Body>
                    <Card.Title className="mb-4">Registrer bruker</Card.Title>
                <div className="justify-content-md-center">
                        <Form.Text className="text-danger" hidden={!this.state.usernameAlreadyExist}>Brukernavnet finnes allerede</Form.Text>
                        <Form.Group>
                            <Form.Control maxLength="25" type="text" name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control maxLength="8" type="number" name="phonenumber" placeholder="Telefonnummer" value={this.state.phonenumvber} onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Text className="text-danger" hidden={!this.state.emailAlreadyExist}>Det er allerede registrert en bruker med denne e-postaddressen</Form.Text>
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




                        <Form.Text className="text-danger" hidden={MegaValidator.validateUsername("nothing", this.state.username)}>Brukernavnet kan kun inneholde tall og bokstaver</Form.Text>
                        <Form.Text className="text-danger" hidden={MegaValidator.validateUsernameLength(this.state.username)}>Brukernavn kreves</Form.Text>

                        <Form.Text className="text-danger" hidden={MegaValidator.validateEmail(this.state.firstEmail, this.state.secondEmail)}>E-postadressene må være like</Form.Text>
                        <Form.Text className="text-danger" hidden={MegaValidator.validateEmailLength(this.state.firstEmail, this.state.secondEmail)}>E-postaddresse kreves</Form.Text>

                        <Form.Text className="text-danger" hidden={MegaValidator.validatePassword(null,this.state.firstPassword,this.state.secondPassword)}>Passordene må være like</Form.Text>
                        <Form.Text className="text-danger" hidden={MegaValidator.validatePasswordLength(this.state.firstPassword,this.state.secondPassword)}>Passordet ditt må være på minst 8 tegn</Form.Text>




                        <Form.Text className="text-danger" hidden={!this.state.databaseConnectionError}>Det oppstod en feil med oppkoblingen til databasen.</Form.Text>



                        <Form.Text> Har du allerede en bruker? <NavLink to="/"> Klikk her for å logge inn. <span className="NavLink"></span></NavLink></Form.Text>

                </div>
                </Card.Body>
                    <Card>
                        <Button variant="btn btn-primary" type="submit" hidden={this.state.loggingIn} disabled={!this.validateForm()}> Registrer bruker </Button>
                        <Button variant="btn btn-primary" disabled hidden={!this.state.loggingIn}><Spinner as="span" animation="border" size="sm" aria-hidden="true"/> Registrerer bruker</Button>
                    </Card>
                </Form>
            </Card>
        )
    }


    submitForm(){
        this.setState({loggingIn: true});
        this.setState({emailAlreadyExist: false});
        this.setState({usernameAlreadyExist: false});
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
                this.setState({emailAlreadyExist: true})
                this.setState({loggingIn: false});
            }
            else if (statusCode === 502){
                this.setState({usernameAlreadyExist: true})
                this.setState({loggingIn: false});
            }
            else if (statusCode === 500){
                console.log("database error, please try again");
                this.setState({loggingIn: false});
            }
        });
    }



}