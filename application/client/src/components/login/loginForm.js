// @flow

import React from 'react';
import {Form, Button, Card} from 'react-bootstrap'



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
        return (

            <Card className="m-4">
            <div className="card-header"><h2 className="card-title">Logg inn</h2></div>
            <div class="m-4">
            <Form onSubmit={this.handleSubmit}>

            <Form.Group>
            <Form.Control type="email" name="email" placeholder="Epostaddresse" value={this.state.email} onChange={this.handleInputChange}/>
            </Form.Group>

            <Form.Group>
            <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
            </Form.Group>

            <Button variant="btn btn-primary btn-lg" type="submit"> Logg inn </Button>

            <Form.Text> Ny bruker? Klikk her for registrere deg</Form.Text>

            </Form>
            </div>
            </Card>

    )
    }

    submitTicket(){


    }

    incorrectPasswordFeedback() {

    }

}