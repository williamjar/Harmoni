// @flow

import React from 'react';
import {Form, Button, Card,Col, Row} from 'react-bootstrap'

export class RegisterForm extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            email : '',
            firstPassword : '',
            secondPassword: '',
            firstEmail: '',
            secondEmail: '',
            flag : 1
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

    handleSubmit(event: Object) {
        event.preventDefault();
        this.submitForm();
    }

    render(): React.Node {
        let infoText;
        if(this.state.flag === -1){
            infoText = <Form.Text className="text-danger"> Feil brukernavn eller passord, vennligst prøv igjen</Form.Text>;
        }
        else if(this.state.flag === -2) {
            infoText =  <Form.Text className="text-danger">Ingen felt kan være tomme!</Form.Text>;
        }
        else if(this.state.flag === -3) {
            infoText =  <Form.Text className="text-danger">Passordene må være like</Form.Text>;
        }
        else if(this.state.flag === -4) {
            infoText =  <Form.Text className="text-danger">Epostadressene må være like</Form.Text>;
        }

        else {
            infoText =  <Form.Text className="text-danger"></Form.Text>;
        }
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

                        <Button variant="btn btn-primary" type="submit"> Registrer deg </Button>

                        {infoText}
                    </Form>
                </div>

            </Card>

        )
    }


    displayLoginDecline(){ this.setState({ flag: -1 }); }
    displayLoginEmpty(){ this.setState({ flag: -2 }); }
    displayPasswordNotSame(){ this.setState({ flag: -3}); }
    displayEmailsNotSame() {this.setState({flag: -4});}


    submitForm(){
        if(this.state.email === '' || this.state.password === ''){ this.displayLoginEmpty(); }
        if(!(this.state.firstPassword === this.state.secondPassword)){ this.displayPasswordNotSame(); }
        if(!(this.state.firstEmail === this.state.secondEmail)){ this.displayEmailsNotSame(); }



        //this.displayLoginDecline(); for declined login from database.

        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.firstEmail" and "this.state.firstPassword";
        * */
    }



}