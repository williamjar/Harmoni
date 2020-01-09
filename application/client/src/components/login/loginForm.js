import React from 'react';
import {Form, Button, Card} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';

export class LoginForm extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            email : '',
            password : ''
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

    // Form validation functions

    validateForm() {
        return ((this.state.email.length > 0) && (this.state.password.length > 0));
    }

    render(){
        return (

            <Card>
                <div className="card-header"><h2 className="card-title text-center">Logg inn</h2></div>
                    <div className="justify-content-md-center m-5">
                        <Form onSubmit={this.handleSubmit}>

                            <Form.Group>
                                <Form.Control type="email" name="email" placeholder="E-postadresse" value={this.state.email} onChange={this.handleInputChange}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                            </Form.Group>

                            <Button variant="btn btn-primary" type="submit" disabled={!this.validateForm()}> Logg inn </Button>

                            <Form.Text> Ny bruker? <NavLink to="/registrer"> Klikk <span className="NavLink">
                                her for registrere deg
                            </span></NavLink></Form.Text>

                            <Form.Text className="text-danger" hidden={!this.databaseUserIncorrectLogin()}>Feil brukernavn eller passord, prøv igjen.</Form.Text>

                            <Form.Text className="text-danger" hidden={!this.databaseConnectionError()}>Beklager, det har skjedde en oppkoblingsfeil.</Form.Text>

                        </Form>
                    </div>
            </Card>
        )
    }




    submitForm(){
        alert("Form submitted." + "\n" + "Username: " + "\n" + this.state.email + "\n" + "Password:"+  "\n" + this.state.password);
        this.props.logIn();
        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.email" and "this.state.password";
        * */
    }

    // Database control functions to display the proper error message to the user.

    databaseUserIncorrectLogin(){
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