// @flow

import React from 'react';
import {Form, Button, Card,Col, Row} from 'react-bootstrap'

export class RegisterForm extends React.Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            email : '',
            password : '',
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
        this.submitTicket();
    }

    render(): React.Node {
        let infoText;
        if(this.state.flag === -1){
            infoText = <Form.Text className="text-danger"> Feil brukernavn eller passord, vennligst prøv igjen</Form.Text>;
        } else if(this.state.flag === -2) {
            infoText =  <Form.Text className="text-danger">Ingen felt kan være tomme!</Form.Text>;
        } else {
            infoText =  <Form.Text className="text-danger"></Form.Text>;
        }
        return (

            <Card>
                <div className="card-header"><h2 className="card-title text-center">Registrer ny bruker</h2></div>

                <div className="justify-content-md-center m-5">
                    <Form onSubmit={this.handleSubmit}>

                        <Form.Group>
                            <Form.Control type="email" name="email" placeholder="E-postadresse" value={this.state.email} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Button variant="btn btn-primary btn-lg" type="submit"> Registrer deg </Button>

                        {infoText}
                    </Form>
                </div>

            </Card>

        )
    }


    displayLoginDecline(){ this.setState({ flag: -1 }); }
    displayLoginEmpty(){ this.setState({ flag: -2 }); }


    submitTicket(){
        if(this.state.email === "" || this.state.password === ""){ this.displayLoginEmpty(); }



        //this.displayLoginDecline();
        //alert("Form submitted." + "\n" + "Username: " + "\n" + this.state.email + "\n" + "Password:"+  "\n" + this.state.password);

        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.email" and "this.state.password";
        * */
    }



}