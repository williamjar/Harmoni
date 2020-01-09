// @flow

import React from 'react';
import {Form, Button, Card, Row, Col, Table} from 'react-bootstrap'


export class UserInfo extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            username: 'William',
            email: 'william@mekanisk.co',
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
        console.log(name + " verdi: " + value);

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
                                <tr><td>E-postaddresse</td><td>{this.state.email}</td></tr>
                                <tr><td>Telefonnummer</td><td>{this.state.phonenumber}</td></tr>
                                </tbody>
                            </Table>
                        </Col>

                        <Col>
                            <Button onClick={() => this.editMode()}>Rediger</Button>

                        </Col>

                        <Col>
                            Profilbilde
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
                    <Form>
                    <Row>
                        <Col>

                                <Table  borderless>
                                    <tbody>

                                    <tr><td>Brukernavn</td><td>
                                        <Form.Group>
                                            <Form.Control type="text" name="username" placeholder={this.state.username} value={this.state.username} onChange={this.handleInputChange}/>
                                        </Form.Group>
                                    </td></tr>


                                    <tr><td>E-postaddresse</td><td>
                                        <Form.Group>
                                            <Form.Control type="email" name="email" placeholder={this.state.email} value={this.state.email} onChange={this.handleInputChange}/>
                                        </Form.Group>

                                        <Form.Group>
                                            <Form.Control type="email" name="email" placeholder="Gjenta e-postaddressen" onChange={this.handleInputChange}/>
                                        </Form.Group>
                                    </td></tr>


                                    <tr><td>Telefonnummer</td><td>
                                        <Form.Group>
                                            <Form.Control type="number" name="phonenumber" placeholder={this.state.phonenumber} value={this.state.phonenumber} onChange={this.handleInputChange}/>
                                        </Form.Group>
                                    </td></tr>


                                    </tbody>
                                </Table>
                            </Col>
                        <Col>
                            <Button variant="success" onClick={() => this.editMode()}>Lagre</Button>

                        </Col>

                        <Col>
                            Profilbilde
                        </Col>

                    </Row>
                </Form >

                </div>
            </Card>
        )}
    }


    editMode() {
        if(this.state.mode===1)this.setState({mode: 2,});
        else this.setState({mode: 1,})
    }



    submitForm(){

        alert("Form is submitted\n")
        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.firstEmail" and "this.state.firstPassword";
        * */
    }

    // Database control functions to display the proper error message to the user.

    databaseAlreadyRegistered(){
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

