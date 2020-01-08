// @flow

import React from 'react';
import {Form, Button, Card,Col} from 'react-bootstrap'



export class LoginForm extends React.Component {

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
        } else {
            infoText =  <Form.Text className="text-danger"></Form.Text>;
        }
        return (

            <Card className="m-5">
                <div className="card-header"><h2 className="card-title">Logg inn</h2></div>
                <Col sm={4}>
                    <div class="m-5">
                        <Form onSubmit={this.handleSubmit}>

                            <Form.Group>
                                <Form.Control type="email" name="email" placeholder="E-postadresse" value={this.state.email} onChange={this.handleInputChange}/>
                            </Form.Group>

                            <Form.Group>
                                <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                            </Form.Group>

                            <Button variant="btn btn-primary btn-lg" type="submit"> Logg inn </Button>

                            <Form.Text> Ny bruker? Klikk her for registrere deg</Form.Text>

                            {infoText}
                        </Form>
                    </div>
                </Col>
            </Card>

        )
    }
    inCorrectLoginFeedback(){

    }

    submitTicket(){
        this.setState({ flag: -1 });
        alert("Form submitted." + "\n" + "Username: " + "\n" + this.state.email + "\n" + "Password:"+  "\n" + this.state.password);

        /*
        *   Service code goes here. The login variables(email, password) can be accessed via the state variables "this.state.email" and "this.state.password";
        * */
    }



}