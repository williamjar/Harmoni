import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image} from 'react-bootstrap'


export class UserPage extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            username: 'William',
            firstEmail: 'william@mekanisk.co',
            secondEmail: '',
            firstPassword: '',
            secondPassword: '',
            profilePicture: 'https://www.jodilogik.com/wordpress/wp-content/uploads/2016/05/people-1.png',
            phonenumber : 95521965,
            mode: 1
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) : void {
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
                                <Table  borderless>
                                    <tbody>
                                    <tr><td>Brukernavn</td><td>{this.state.username}</td></tr>
                                    <tr><td>E-postaddresse</td><td>{this.state.firstEmail}</td></tr>
                                    <tr><td>Telefonnummer</td><td>{this.state.phonenumber}</td></tr>
                                    <tr>
                                        <td>
                                            <Button onClick={() => this.editMode()}>Oppdater brukerprofil</Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>

                            <Col>
                                <Image roundedCircle fluid thumbnail src={this.state.profilePicture} rounded />
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
                                                <Form.Control type="text" name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.handleInputChange}/>
                                            </td>
                                        </tr>

                                        <td>E-postaddresse</td><td>
                                            <Form.Group>
                                                <Form.Control type="email" name="firstEmail" value={this.state.firstEmail} onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="email" name="secondEmail" placeholder="Gjenta e-postaddressen" onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td>


                                        <tr><td>Telefonnummer</td><td>
                                            <Form.Group>
                                                <Form.Control type="number" name="phonenumber" placeholder={this.state.phonenumber} value={this.state.phonenumber} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td></tr>

                                        <tr><td>Passord</td><td>
                                            <Form.Group>
                                                <Form.Control type="password" name="firstPassword" placeholder="Nytt passord" value={this.state.firstPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="password" name="secondPassword" placeholder="Gjenta nytt passord" value={this.state.secondPassword} onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Row>
                                                <Form.Group><Button className={"ml-1"} variant="secondary">Last opp profilbilde</Button></Form.Group>
                                                <Form.Group><Button className={"ml-1"} variant="danger" onClick={() => this.editMode()}>Avbryt</Button></Form.Group>
                                                <Form.Group><Button className={"ml-1"} variant="success" type="submit" disabled={!this.validateForm()}>Lagre</Button></Form.Group>
                                                </Row>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col>
                                    <Image roundedCircle fluid thumbnail p-5 src={this.state.profilePicture} rounded />
                                </Col>
                            </Row>
                        </Form >
                    </div>
                </Card>
            )}
    }

    validateEmail(){
        return (this.state.firstEmail === this.state.secondEmail) && (this.state.firstEmail.length > 0);
    }

    validatePassword(){
        return (this.state.firstPassword === this.state.secondPassword) && (this.state.firstPassword > 0);
    }

    validateForm(){
        return this.validateEmail() || this.validatePassword();
    }

    editMode() {
        if(this.state.mode===1)this.setState({mode: 2,});
        else this.setState({mode: 1,})
    }


    submitForm(){

        this.setState({firstPassword: '', secondPassword: '', secondEmail: ''});
        this.editMode();
    }

    // Database control functions to display the proper error message to the user.

    databaseConnectionError() {
        return false;
        /*
         * return true if there is a database connection error
         */
    }
}

