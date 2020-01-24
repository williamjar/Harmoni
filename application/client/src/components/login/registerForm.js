import React from 'react';
import {Form, Button, Card, Row, Col, Spinner, Modal} from 'react-bootstrap'
import {RegisterOrganizerService} from "../../store/registerOrganizerService";
import { createHashHistory } from 'history';
import {NavLink} from "react-router-dom";
import {MegaValidator} from "../../megaValidator";

let history = createHashHistory();

/**
 * @class RegisterForm
 * @classdesc Component for registering a new user.
 */
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
            loggingIn: false,
            confirmTermsOfService: false,
            showGDPR: false,
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

    validateForm() {
        return MegaValidator.validateEmail(this.state.firstEmail,this.state.secondEmail) &&
            MegaValidator.validatePassword("nothing", this.state.firstPassword, this.state.secondPassword) &&
            MegaValidator.validateUsername("nothing",this.state.username) &&
            MegaValidator.validateUsernameLength(this.state.username) &&
            MegaValidator.validatePhoneNumber(11111111, this.state.phonenumber)
            && this.state.confirmTermsOfService;
    }

    render() {

        return (
            <Card style={{width : '35rem'}} className="text-center mx-auto mt-5 drop-shadow">
                <Modal show={this.state.showGDPR} >
                    <Modal.Header closeButton>
                        <Modal.Title>Harmoni: personsvernserklæring</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Ved å godta vår personverserklæring, samtykker du med at vi lagrer informasjon som epost og telefonnummer, samt oppgitt brukernavn. Denne informasjonen blir brukt for å kunne identfisere arrangørene. Epost og telefon kan bli brukt for å komme i kontakt med arrangøren</Modal.Body>
                    <Modal.Body>Ved å samtykke, bekrefter du at du har tillatelse til å lagre personlig informasjon om artister, ansatte eller evt. andre du vil lagre informasjon om i systemet "Harmoni"</Modal.Body>
                    <Modal.Body>Dine data kan aksesseres, endres og slettes helt i henhold til GDPR, ved å logge inn og gå til brukerprofilen din. Har du andre ønsker, kan du kontakte oss.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>this.setState({showGDPR:false})}>
                            Lukk
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Form onSubmit={this.handleSubmit} className={"align-items-center"}>
                    <Card.Body>
                        <Card.Title className="mb-4">Registrer ny bruker</Card.Title>
                        <div className="justify-content-md-center">
                            <Form.Text className="text-danger" hidden={!this.state.usernameAlreadyExist}>Brukernavnet finnes allerede</Form.Text>
                            <Form.Group>
                                <Form.Control maxLength="25" type="text" name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control maxLength="8" type="tel" name="phonenumber" placeholder="Telefonnummer" value={this.state.phonenumber} onChange={this.handleInputChange}/>
                            </Form.Group>
                            <Form.Text className="text-danger" hidden={!this.state.emailAlreadyExist}>Det er allerede registrert en bruker med denne e-postadressen</Form.Text>
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
                            <Form.Group>
                                <Button variant="outline-secondary" className="text-link" onClick={()=>this.functionToShowGDPR()}> Les vår personvernserklæring </Button>
                                <Form.Check name="confirmTermsOfService" value={this.state.confirmTermsOfService}  onChange={this.handleInputChange} type="checkbox" label="Godkjenn personvernserklæring"/>
                            </Form.Group>
                                <Form.Text className="text-danger">{this.errorHandler()}</Form.Text>

                                <Form.Text className="text-danger" hidden={!this.state.databaseConnectionError}>Det oppstod en feil med oppkoblingen til databasen.</Form.Text>

                            <Form.Text> Har du allerede en bruker? <NavLink to="/"> Klikk her for å logge inn. <span className="NavLink"/></NavLink></Form.Text>
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


    errorHandler(){
        if(!MegaValidator.validateUsernameLength(this.state.username)){
            return "Brukernavn kreves";
        }
        if(!MegaValidator.validateEmailLength(this.state.firstEmail, this.state.secondEmail)){
            return "E-postadresse kreves";
        }
        if(!MegaValidator.validateUsername("nothing", this.state.username)){
            return "Brukernavnet kan kun inneholde tall og bokstaver";
        }
        if(!MegaValidator.validateEmail(this.state.firstEmail, this.state.secondEmail)){
            return "E-postadressene må være like";
        }
        if(!MegaValidator.validatePasswordLength(this.state.firstPassword,this.state.secondPassword)){
            return "Passordet ditt må være på minst 8 tegn";
        }
        if(!MegaValidator.validatePassword(null,this.state.firstPassword,this.state.secondPassword)){
            return "Passordene må være like";
        }
        if(MegaValidator.checkForEInNumber(this.state.phonenumber)){
            return"Telefonnummeret ditt inneholder ugyldige symboler";
        } else {
            return ""
        }

    }

    functionToShowGDPR(){
        this.setState({showGDPR: true});
    }

    submitForm(){
        this.setState({loggingIn: true});
        this.setState({emailAlreadyExist: false});
        this.setState({usernameAlreadyExist: false});

        RegisterOrganizerService.registerOrganizer(this.state.username, this.state.phonenumber,this.state.firstEmail, this.state.firstPassword, statusCode => {
            if (statusCode === 200){
                history.push('/');
            }
            else if (statusCode === 501){
                this.setState({emailAlreadyExist: true});
                this.setState({loggingIn: false});
            }
            else if (statusCode === 502){
                this.setState({usernameAlreadyExist: true});
                this.setState({loggingIn: false});
            }
            else if (statusCode === 500){
                this.setState({loggingIn: false});
            }
        });
    }

}

