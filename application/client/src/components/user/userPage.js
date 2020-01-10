import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image} from 'react-bootstrap'


export class UserPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            newUsername: '',
            email: 'william@mekanisk.co',
            newEmail: '',
            confirmNewEmail: '',
            firstNewPassword: '',
            secondNewPassword: '',
            phonenumber : '',
            newPhonenumber: '',
            profilePicture: 'https://www.jodilogik.com/wordpress/wp-content/uploads/2016/05/people-1.png',
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

    // Functions to verify the contents in the form.
    render() {
        if(this.state.mode===1){
            return (
                <Card>
                    <div className="justify-content-md-center m-5">
                        <h2>Brukerprofil</h2>
                        <br></br>
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
                                <Image width={"140px"} roundedCircle fluid thumbnail src={this.state.profilePicture} rounded />
                            </Col>
                        </Row>
                    </div>
                </Card>
            )}

        else{
            return(
                <Card>
                    <div className="justify-content-md-center m-5">
                        <h2>Brukerprofil</h2>
                        <br></br>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col>
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
                                                <Form.Control type="email" name="newEmail" value={this.state.newEmail} placeholder={this.state.email} onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="email" name="confirmNewEmail" value={this.state.confirmNewEmail} placeholder="Gjenta e-postaddressen" onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td>

                                        <tr><td>Telefonnummer</td><td>
                                            <Form.Group>
                                                <Form.Control type="number" name="newPhonenumber" placeholder={this.state.phonenumber} value={this.state.newPhonenumber} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td></tr>

                                        <tr><td>Passord</td><td>
                                            <Form.Group>
                                                <Form.Control type="password" name="firstNewPassword" placeholder="Nytt passord" value={this.state.firstNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="password" name="secondNewPassword" placeholder="Gjenta nytt passord" value={this.state.secondNewPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Row>
                                                <Form.Group><Button className={"ml-1"} variant="secondary">Last opp profilbilde</Button></Form.Group>
                                                <Form.Group><Button className={"ml-1"} variant="danger" onClick={() => this.changeMode()}>Avbryt</Button></Form.Group>
                                                <Form.Group><Button className={"ml-1"} variant="success" type="submit" disabled={!this.validateForm()}>Lagre</Button></Form.Group>
                                                </Row>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col>
                                    <Image width={"140px"} roundedCircle fluid thumbnail p-5 src={this.state.profilePicture} rounded />
                                </Col>
                            </Row>
                        </Form >
                    </div>
                </Card>
            )}
    }

    validateUsername(){
        return (this.state.username !== this.state.newUsername) && (this.state.newUsername.length > 0);
    }

    validatePhoneNumber(){
        return (this.state.newPhonenumber !== this.state.phonenumber) && (this.state.newPhonenumber.length > 0);
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


    submitForm(){
        if(this.validateUsername()) this.setState({username: this.state.newUsername});
        if(this.validateEmail()) this.setState({email: this.state.newEmail});
        if(this.validatePhoneNumber())this.setState({phonenumber: this.state.newPhonenumber});

        this.setState({newUsername: ''});
        this.setState({newEmail: ''});
        this.setState({newPhonenumber: ''});

        this.changeMode();
    }

    // Database control functions to display the proper error message to the user.

    databaseConnectionError() {
        return false;
        /*
         * return true if there is a database connection error
         */
    }
}

