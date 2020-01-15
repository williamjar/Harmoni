import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image, CardColumns, ListGroup, CardDeck, Spinner} from 'react-bootstrap'
import {CardText} from "react-bootstrap/Card";
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";

export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            newUsername: '',
            email: '',
            oldPassword: '',
            firstNewPassword: '',
            secondNewPassword: '',
            phonenumber : '',
            newPhonenumber: '',
            profilePicture: 'http://www.jacqueslacoupe.com/images/sample-user.png',
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
                                    <tr><td>E-postaddresse</td><td>{this.state.email}</td></tr>
                                    <tr><td>Brukernavn</td><td>{this.state.username}</td></tr>
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
                                        <tr><td>E-postaddresse</td><td>{this.state.email}</td></tr>
                                        <tr>
                                            <td>Brukernavn</td>
                                            <td>
                                                <Form.Control type="text" name="newUsername" placeholder={this.state.username} value={this.state.newUsername} onChange={this.handleInputChange}/>
                                                <Form.Text className={"text-danger"} hidden={!(this.state.newUsername.toLowerCase()==="geir")}>Geir er ikke et gydlig brukernavn</Form.Text>

                                            </td>
                                        </tr>

                                        <tr><td>Telefonnummer</td><td>
                                            <Form.Group>
                                                <Form.Control maxLength="8" type="number"  name="newPhonenumber" placeholder={this.state.phonenumber} value={this.state.newPhonenumber} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td></tr>

                                        <tr><td>Passord</td><td>

                                            <Form.Group>
                                                <Form.Control type="password" name="oldPassword" placeholder="Gammelt passord" value={this.state.oldPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                            <Row>
                                                <Col>
                                            <Form.Group>
                                                <Form.Control type="password" name="firstNewPassword" placeholder="Nytt passord" value={this.state.firstNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                                </Col>
                                                <Col>

                                            <Form.Group>
                                                <Form.Control type="password" name="secondNewPassword" placeholder="Gjenta nytt passord" value={this.state.secondNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                                </Col>
                                            </Row>
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
                                    <ListGroup.Item className="text-success" hidden={!this.validateUsername()}>Endre brukernavn til {this.state.newUsername}</ListGroup.Item>
                                    <ListGroup.Item className="text-success" hidden={!this.validatePhoneNumber()}>Endre telefonnummer til {this.state.newPhonenumber}</ListGroup.Item>
                                    <ListGroup.Item className="text-success" hidden={!this.validatePassword()}>Utfør en passordendring</ListGroup.Item>
                                </ListGroup>
                                <Form.Group className={"mt-4"}>
                                    <Button variant="success" type="submit" disabled={!this.validateForm()} hidden={this.state.savingInformation}>Utfør endringer</Button>
                                    <Button variant="success" disabled hidden={!this.state.savingInformation}><Spinner as="span" animation="border" size="sm" aria-hidden="true"/> Lagrer informasjon</Button>
                                </Form.Group>
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
            return (this.state.username !== this.state.newUsername) && (this.state.newUsername.length > 0) && !(this.state.newUsername.toLowerCase()==="geir");
        }
    }

    validatePhoneNumber(){
        return (this.state.newPhonenumber !== this.state.phonenumber) && (this.state.newPhonenumber.length === 8);
    }

    validatePassword(){
        return (this.state.firstNewPassword === this.state.secondNewPassword) && (this.state.firstNewPassword.length > 0);
    }

    validateForm(){
        return this.validatePassword() || this.validatePhoneNumber() || this.validateUsername();
    }

    changeMode() {
        this.setState({savingInformation: false});
        if(this.state.mode===1)this.setState({mode: 2,});
        else this.setState({mode: 1,})
    }

    updateInfo(){
        console.log("currentuserID: " + CookieStore.currentUserID);
       OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            if (statusCode === 200){
                console.log("User is here:" + OrganizerStore.currentOrganizer.username);

                var databaseUsername = OrganizerStore.currentOrganizer.username;
                var dataBbaseEmail = OrganizerStore.currentOrganizer.email;
                var databasePhone = OrganizerStore.currentOrganizer.phone;

                this.setState(this.setState({
                    username: databaseUsername,
                    email: dataBbaseEmail,
                    phonenumber: databasePhone
                }));
            }
            else{
                //console.log("We have an error!");
            }
        });
    }

    submitForm(){
        this.setState({savingInformation: true});

        if(this.validateUsername()) {
            OrganizerStore.changeUsername(CookieStore.currentUserID, this.state.newUsername).then(r => {
                    this.setState({savingInformation: false});
                    this.changeMode();
                    this.setState({username: this.state.newUsername});
            });}


        if(this.validatePhoneNumber()){
            this.changeMode();
            this.setState({phonenumber: this.state.newPhonenumber});
        }


        if(this.validatePassword()) {
            OrganizerStore.changePassword(CookieStore.currentUserID, this.state.oldPassword, this.state.firstNewPassword).then(r =>{
                this.setState({savingInformation: false});
                this.changeMode();
                this.setState({username: this.state.newUsername});
            });
        }

    }



}

