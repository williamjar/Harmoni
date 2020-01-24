import React from 'react';
import {Form, Button, Card, Spinner} from 'react-bootstrap'
import { NavLink } from 'react-router-dom';
import {LoginService} from "../../store/loginService";
import Logo from '../menu/Logo_large.png';

/**
 * @class LoginForm
 * @classdesc Component for logging in the user.
 */
export class LoginForm extends React.Component {
    /**
     * Creates a log in form with states
     */
    _mounted = false;
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password : '',
            loginError : false,
            serverError: false,
            loggingIn: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleInputChange(event){
        this.setState({serverError: false});
        this.setState({loginError: false});
        this.setState({loggingIn: false});
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value,});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    validateForm() {
        return ((this.state.email.length > 0) && (this.state.password.length > 0));
    }

    render(){
        return (
            <Card style={{width : '35rem'}} className="text-center mx-auto mt-5 drop-shadow">
                <Form onSubmit={this.handleSubmit} className={"align-items-center"}>
                    <Card.Body>
                        <div className="login-logo">
                            <img alt={"Harmoni Logo"} src={Logo} />
                        </div>
                        <Card.Title className="mb-4">Logg inn</Card.Title>
                        <Form.Group>
                            <Form.Control type="email" name="email" placeholder="E-postadresse" value={this.state.email} onChange={this.handleInputChange}/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="password" maxLength="30" name="password" placeholder="Passord" value={this.state.password} onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Form.Text className="text-danger" hidden={!this.state.loginError}>Feil brukernavn eller passord</Form.Text>
                        <Form.Text className="text-danger" hidden={!this.state.serverError}>Feil med oppkoblingen, prøv igjen senere</Form.Text>
                        <Form.Text> Ny bruker? <NavLink to="/registrer"> Klikk <span className="NavLink">
                            her for registrere deg
                        </span></NavLink></Form.Text>

                    </Card.Body>
                    <Card>
                        <Button variant="btn btn-primary" type="submit" hidden={this.state.loggingIn} disabled={!this.validateForm()}> Logg inn</Button>
                        <Button variant="btn btn-primary" disabled hidden={!this.state.loggingIn}><Spinner as="span" animation="border" size="sm" aria-hidden="true"/> Logger inn</Button>
                    </Card>
                </Form>
            </Card>
        )
    }

    submitForm() {
        this.dataBaseLogin();
    }

    dataBaseLogin(){
        this.setState({loggingIn: true});
        LoginService.loginOrganizer(this.state.email, this.state.password, status => {
            if (status===200) {
                sessionStorage.setItem('loggedIn', 'true');
                this.props.logIn();
                if(this._mounted) this.setState({loggingIn: false});
            } else if(status===501 || status ===502){
                if(this._mounted) this.setState({loggingIn: false});
                if(this._mounted) this.setState({loginError: true});
            } else {
                if(this._mounted) this.setState({loggingIn: false});
                if(this._mounted) this.setState({serverError: true});
            }
        });
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }
}