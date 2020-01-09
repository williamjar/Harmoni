import React from 'react';
import {Button, Card, Col, Form, Row, Table, Image} from 'react-bootstrap'


export class UserInfo extends React.Component {
    constructor(props: Object) {
        super(props);
        this.state = {
            username: 'William',
            firstEmail: 'william@mekanisk.co',
            secondEmail: '',
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
                                        <Button onClick={() => this.editMode()}>Rediger</Button>
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
                                                <Form.Control type="password" name="firstPassword" placeholder="Nytt passord" onChange={this.handleInputChange}/>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Control type="password" name="secondPassword" placeholder="Gjenta nytt passord" onChange={this.handleInputChange}/>
                                            </Form.Group>
                                        </td>
                                        </tr>

                                        <tr>
                                        <td>
                                            <Button variant="success" type="submit">Lagre</Button>
                                            <Button variant="secondary">Last opp profilbilde</Button>
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


    editMode() {
        if(this.state.mode===1)this.setState({mode: 2,});
        else this.setState({mode: 1,})
    }



    submitForm(){
        this.editMode();


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

