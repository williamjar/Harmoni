import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image, CardColumns, ListGroup, CardDeck, Spinner} from 'react-bootstrap'
import {CardText} from "react-bootstrap/Card";
import {OrganizerService} from "../../store/organizerService";
import {CookieStore} from "../../store/cookieStore";

export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            newUsername: '',
            email: '',
            newEmail: '',
            confirmNewEmail: '',
            firstNewPassword: '',
            secondNewPassword: '',
            phonenumber : '',
            newPhonenumber: '',
            profilePicture: '',
            savingInformation: false,
            mode: 1
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

    componentDidMount() {
        this.updateInfo();
    }

    // Functions to verify the contents in the form.
    render() {
        if(this.state.mode===1){
            return (
                <Card className={"border-0"}>
                    <div className="justify-content-md-center m-5">
                        <CardDeck>
                        <br></br>
                            <Card className={"p-2 card border-0"}>
                                <Card.Title>Brukerprofil</Card.Title>
                                <Table borderless>
                                    <tbody>
                                    <tr><td>Brukernavn</td><td>{this.state.username}</td></tr>
                                    <tr><td>E-postaddresse</td><td>{this.state.email}</td></tr>
                                    <tr><td>Telefonnummer</td><td>{this.state.phonenumber}</td></tr>
                                    <tr>
                                        <td>
                                            <Button onClick={() => this.changeMode()}>Oppdater brukerprofil</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Card>
                            <Card className={"p-2 card border-0"}>
                                <Image width={"140px"} roundedCircle fluid thumbnail src={this.state.profilePicture} rounded />
                            </Card>
                        </CardDeck>
                    </div>
                </Card>
            )}

        else{
            return(
                <Card className={"border-0"}>
                    <div className="justify-content-md-center m-5">
                        <Form onSubmit={this.handleSubmit}>
                        <CardDeck>
                            <Card className={"p-2 card border-0"}>
                                <Card.Title>Rediger brukerprofil</Card.Title>
                                    <Table  borderless>
                                        <tbody>
                                        <tr>
                                            <td>Brukernavn</td>
                                            <td>
                                                <Form.Control type="text" name="newUsername" placeholder={this.state.username} value={this.state.newUsername} onChange={this.handleInputChange}/>
                                            </td>
                                        </tr>

                                        <td>E-postaddresse</td><td>
                                            <Form.Group>
                                                <Form.Control type="email" name="newEmail" value={this.state.newEmail} placeholder="Ny e-postaddresse" onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="email" name="confirmNewEmail" value={this.state.confirmNewEmail} placeholder="Gjenta e-postaddressen" onChange={this.handleInputChange}/>
                                            </Form.Group>
                                            <Form.Text className={"text-muted"}>Den oppdaterte e-postaddressen må være lik i begge feltene.</Form.Text>
                                        </td>

                                        <tr><td>Telefonnummer</td><td>
                                            <Form.Group>
                                                <Form.Control maxLength="8" type="number"  name="newPhonenumber" placeholder={this.state.phonenumber} value={this.state.newPhonenumber} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td></tr>

                                        <tr><td>Passord</td><td>
                                            <Form.Group>
                                                <Form.Control type="password" name="firstNewPassword" placeholder="Nytt passord" value={this.state.firstNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="password" name="secondNewPassword" placeholder="Gjenta nytt passord" value={this.state.secondNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                            <Form.Text className={"text-muted"}>Det oppdaterte passordet må være lik i begge feltene.</Form.Text>
                                        </td>
                                        </tr>
                                        </tbody>
                                    </Table>

                            </Card>
                            <Card className={"p-2 card border-0"}>
                                 <Image width={"140px"} roundedCircle fluid thumbnail p-5 src={this.state.profilePicture} rounded />
                                 <Form.Group><Button variant="secondary">Last opp profilbilde</Button></Form.Group>

                            <br></br>

                            </Card>
                        </CardDeck>
                            <CardDeck>

                            <Card className={"p-2 card border-0"}>
                                <ListGroup>
                                    <ListGroup.Item>Endringer:</ListGroup.Item>
                                    <ListGroup.Item disabled hidden={this.validateForm()}>Ingen endringer registrert. Utfør endringer over, eller avbryt.</ListGroup.Item>
                                    <ListGroup.Item className="text-danger" hidden={!this.validateUsername()}>Endre brukernavn til {this.state.newUsername}</ListGroup.Item>
                                    <ListGroup.Item className="text-danger" hidden={!this.validateEmail()}>Endre e-postaddresse fra {this.state.email} til {this.state.newEmail}</ListGroup.Item>
                                    <ListGroup.Item className="text-danger" hidden={!this.validatePhoneNumber()}>Endre telefonnummer til {this.state.newPhonenumber}</ListGroup.Item>
                                    <ListGroup.Item className="text-danger" hidden={!this.validatePassword()}>Utfør en passordendring</ListGroup.Item>
                                </ListGroup>
                                <Form.Group className={"mt-4"}><Button variant="success" type="submit" disabled={!this.validateForm()} hidden={this.state.savingInformation}>Utfør endringer</Button></Form.Group>
                                <Form.Group><Button variant="success" disabled hidden={!this.state.savingInformation}><Spinner as="span" animation="border" size="sm" aria-hidden="true"/> Lagrer informasjon</Button></Form.Group>

                                <Form.Group><Button className="align-right" variant="danger" onClick={() => this.changeMode()}>Avbryt</Button></Form.Group>
                            </Card>

                                <Card className={"p-2 card border-0"}>
                                </Card>
                            </CardDeck>

                    </Form>
                    </div>
                </Card>
            )}
    }


    validateUsername(){
        let  illegalCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(illegalCharacters.test(this.state.newUsername)){
            return false;
        }else{
            return (this.state.username !== this.state.newUsername) && (this.state.newUsername.length > 0);
        }
    }

    validatePhoneNumber(){
        return (this.state.newPhonenumber !== this.state.phonenumber) && (this.state.newPhonenumber.length === 8);
    }

    validateEmail(){
        return (this.state.newEmail === this.state.confirmNewEmail) && (this.state.newEmail.length > 0) && (this.state.email !== this.state.newEmail);
    }

    validatePassword(){
        return (this.state.firstNewPassword === this.state.secondNewPassword) && (this.state.firstNewPassword.length > 0);
    }

    validateForm(){
        return this.validateEmail() || this.validatePassword() || this.validatePhoneNumber() || this.validateUsername();
    }

    changeMode() {
        if(this.state.mode===1)this.setState({mode: 2,});
        else this.setState({mode: 1,})
    }



    updateInfo(){

        //var user = OrganizerService.getOrganizer(CookieStore.currentUserID);


        var databaseUsername = '';
        var databaseEmail = '';

        this.setState(this.setState({
            username: databaseUsername,
            email: databaseEmail,
        }));
    }

    submitForm(){

        this.setState({savingInformation: true});

        if(this.validateUsername()) this.setState({username: this.state.newUsername});
        //Service: update username
        if(this.validateEmail()) this.setState({email: this.state.newEmail});
        //Service: update email
        if(this.validatePhoneNumber())this.setState({phonenumber: this.state.newPhonenumber});
        //Service: update phone number
        if(this.validatePassword()) {
            // /api/organizer/:organizerID
        }

        // /api/contact/:contactID

        this.setState({newUsername: ''});
        this.setState({newEmail: ''});
        this.setState({newPhonenumber: ''});
        this.setState({firstNewPassword: ''});
        this.setState({secondNewPassword: ''});

        this.changeMode();
        this.setState({savingInformation: false});
    }

    // Database control functions to display the proper error message to the user.

    databaseConnectionError() {
        return false;
        /*
         * return true if there is a database connection error
         */
    }
}

