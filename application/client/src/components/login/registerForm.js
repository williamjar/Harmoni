// @flow

import React from 'react';
import {Form, Button, Card} from 'react-bootstrap'

export class RegisterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstEmail: '',
            secondEmail: '',
            firstPassword : '',
            secondPassword: ''
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

    validatePassword(){
        return this.state.firstPassword === this.state.secondPassword;
    }

    validateEmail(){
        return this.state.firstEmail === this.state.secondEmail;
    }

    validateForm() {
        return (this.validateEmail() && (this.validatePassword())) && (this.state.firstEmail.length > 0 && this.state.firstPassword.length >= 8);
    }

    render() {

        return (
            <Card>
                <div className="card-header"><h2 className="card-title text-center">Registrer ny bruker</h2></div>

                <div className="justify-content-md-center m-5">
                    <Form onSubmit={this.handleSubmit}>

                        <Form.Group>
                            <Form.Control type="email" name="firstEmail" placeholder="E-postadresse" value={this.state.firstEmail} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="email" name="secondEmail" placeholder="Gjenta e-postadresse" value={this.state.secondEmail} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="password" maxLength="30" name="firstPassword" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="password" maxLength="30" name="secondPassword" placeholder="Gjenta passord" value={this.state.password} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Button variant="btn btn-primary" type="submit" disabled={!this.validateForm()}> Registrer deg </Button>

                        <Form.Text className="text-danger" hidden={this.validateEmail()}>Epostadressene må være like</Form.Text>

                        <Form.Text className="text-danger" hidden={this.validatePassword()}>Passordene må være like</Form.Text>

                        <Form.Text className="text-danger" hidden={this.validateForm()}>Passordet ditt må være på minst 8 tegn</Form.Text>

                        <Form.Text className="text-danger" hidden={!this.databaseAlreadyRegistered()}>Det er allerede registrert en bruker med denne e-postaddressen</Form.Text>

                        <Form.Text className="text-danger" hidden={!this.databaseConnectionError()}>Det oppstod en feil med oppkoblingen til databasen.</Form.Text>

                    </Form>
                </div>
            </Card>
        )
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