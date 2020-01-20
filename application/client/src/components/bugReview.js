import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Button from "react-bootstrap/Button";
import {TicketStore} from "../store/ticketStore";
import {EventStore} from "../store/eventStore";
import Form from "react-bootstrap/Form";
import {BugStore} from "../store/bugStore";
import {OrganizerStore} from "../store/organizerStore";

export class BugReview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            description : '',
            resolved : ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render(){
        return(
                <Card.Body>
                    <FormGroup controlId="ControlTextarea">
                        <FormLabel>
                            Skriv her
                        </FormLabel>
                        <FormControl
                            as="textarea" rows="3"
                            name = "description"
                            placeholder = "Skriv din tilbakemelding her"
                            value = {this.state.description}
                            onChange = {this.handleInputChange}/>

                            <Button onSubmit={this.handleSubmit}>
                            Send tilbakemelding
                        </Button>
                    </FormGroup>
                </Card.Body>
        )
    }

    handleInputChange(event) {
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        this.setState({[name]: value,});

    }

    handleSubmit(event){
        console.log('handleubmit');
        console.log(this.state.description);
        event.preventDefault();
        BugStore.registerBug(OrganizerStore.currentOrganizer, this.state.description, this.state.date,  statusCode => {
                if (statusCode === 200){
                    alert("Din tilbakemelding ble registrert");
                }else{
                    alert("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!");
                }
            });

    };

    onSubmit = () => {
        console.log('Tilbakemlding sendt');
    }
}