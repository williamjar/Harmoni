import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import { FaCalendar } from 'react-icons/fa';
import ListGroup from "react-bootstrap/ListGroup";
import {Table} from "react-bootstrap";
import {FaAngleDown} from "react-icons/all";
import {TicketStore} from "../store/ticketStore";
import {EventStore} from "../store/eventStore";


/*
    Static labels to guide the users witch type om information
    they are supposed to fill inn.
*/
let nameTicekt = 'Navn billett';
let priceTicket = 'Billett pris';
let amountTicket = 'Antall billetter';
let releaseDate = 'Slipp dato';
let releaseTime ='Slipp klokkelsett';
let endDate = 'Salg slutt dato';
let endTime = 'Salg slutt klokkeslett';
let description = 'Skriv inn informasjon om billetten';


/*
    Component to share all the ticket components
*/
export class Ticket extends Component{
    render(){
        return(
            <Card>
                <Form>
                    <TicketAll/>
                </Form>
            </Card>
        );

    }
}

/*
    The component both fetch tickets from database, post new tickets
    and delete tickets from the database.
*/
export class TicketAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketTypeName: '',
            price : '',
            amount : '',
            releaseDate : '',
            endDate : '',
            releaseTime : '',
            endTime : '',
            description : '',
            ticketList : []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return(
            <Card.Body>
                <ListGroup>
                    {this.state.ticketList.map(ticket => (
                        <ListGroup.Item>
                            <Form>
                                <Form.Row className="ticketStyle" >
                                    <Col sm={2}>
                                        <Form.Text>{nameTicekt}</Form.Text>
                                        <Form.Control
                                            value={ticket.ticketTypeName}
                                            readOnly
                                        />

                                    </Col>
                                    <Col sm={1}>
                                        <Form.Text>{priceTicket}</Form.Text>
                                        <Form.Control
                                            value={ticket.price}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Text>{amountTicket}</Form.Text>
                                        <Form.Control
                                            value={ticket.amount}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <Form.Text>{releaseDate}</Form.Text>
                                        <Form.Control
                                            value={ticket.releaseDate}
                                            readOnly
                                        />
                                    </Col>

                                    <Col sm={2}>
                                        <Form.Text>{endDate}</Form.Text>
                                        <Form.Control
                                            value={ticket.endDate}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Text>{releaseTime}</Form.Text>
                                        <Form.Control
                                            value={ticket.releaseTime}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Text>{endTime}</Form.Text>
                                        <Form.Control
                                            value={ticket.endTime}
                                            readOnly
                                        />
                                    </Col>
                                    <Col>
                                        <h5><FaCalendar/></h5>
                                    </Col>
                                </Form.Row>
                                <Form.Row className="ticketStyle">
                                    <Col sm={6}>
                                        <Form.Text>{description}</Form.Text>
                                        <Form.Control
                                            value={ticket.description}
                                            readOnly
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row className="ticketStyle">
                                    <Col sm={6}>
                                        <button id={ticket.ticketTypeID} onClick={this.deleteTicket}>Slett billett</button>
                                    </Col>
                                </Form.Row>
                            </Form>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Accordion>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        + Legg til en ny billett
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <p>Fyll inn alle informasjon om billetten</p>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Row className="ticketStyle">
                                    <Col>
                                        <Form.Text>{nameTicekt}</Form.Text>
                                        <Form.Control
                                            name = "ticketTypeName"
                                            placeholder = "Navn"
                                            value = {this.state.ticketTypeName}
                                            onChange = {this.handleInputChange}

                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{priceTicket}</Form.Text>
                                        <Form.Control
                                            name = "price"
                                            placeholder="Pris,-"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.price}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{amountTicket}</Form.Text>
                                        <Form.Control
                                            name = "amount"
                                            placeholder="Antall"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.amount}

                                        />

                                    </Col>
                                    <Col>
                                        <Form.Text>{releaseDate}</Form.Text>
                                        <Form.Control
                                            type = "date"
                                            name = "releaseDate"
                                            onChange={this.handleInputChange}
                                            value = {this.state.releaseDate}
                                        />

                                    </Col>
                                    <Col>
                                        <Form.Text>{endDate}</Form.Text>
                                        <Form.Control
                                            type ="date"
                                            name = "endDate"
                                            onChange={this.handleInputChange}
                                            value = {this.state.endDate}

                                        />
                                    </Col>
                                    <Col >
                                        <Form.Text>{releaseTime}</Form.Text>
                                        <Form.Control
                                            type = "time"
                                            name = "releaseTime"
                                            onChange={this.handleInputChange}
                                            value = {this.state.releaseTime}
                                        />
                                    </Col>
                                    <Col >
                                        <Form.Text>{endTime}</Form.Text>
                                        <Form.Control
                                            type = "time"
                                            name = "endTime"
                                            onChange={this.handleInputChange}
                                            value = {this.state.endTime}
                                        />
                                    </Col>
                                    <Col>
                                        <h5><FaCalendar/></h5>
                                    </Col>
                                </Form.Row>
                                <Form.Row className="ticketStyle">
                                    <Col sm={6}>
                                        <Form.Text>{description}</Form.Text>
                                        <Form.Control
                                            name = "description"
                                            placeholder="Beskrivelse"
                                            onChange={this.handleInputChange}
                                            value = {this.state.description}
                                        />
                                    </Col>
                                </Form.Row>
                                <Button eventKey="1" variant="primary" size="sm" type="submit" onClick={this.handleSubmit}>
                                    Lagre billett
                                </Button>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Accordion>
            </Card.Body>
        );
    }
    /*
        Fetches all tickets from the databse the moment the page opens.
    */
    componentDidMount() {
        this.listTickets();
    }

    /*
        Updates all the states when changed.
    */
    handleInputChange(event) {
        console.log(this.state.ticketTypeName);
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        console.log(name + " verdi: " + value);
        this.setState({[name]: value,});

    }

    /*
        Post the new ticket in the database and notifies the user
        with an alert message.
    */
    handleSubmit(event){
        event.preventDefault();
        TicketStore.addTicket(EventStore.currentEvent.eventID,
            this.state.ticketTypeName, this.state.price, this.state.amount,
            this.state.releaseDate, this.state.releaseTime, this.state.endDate,
            this.state.endTime, this.state.description, statusCode => {
                if (statusCode === 200){
                    TicketStore.getAllTickets(EventStore.currentEvent.eventID, () => {
                        this.setState({ticketList: TicketStore.allTickets})
                    });
                    alert("Billetten ble publisert");
                }else{
                    alert("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!");
                }
            });

    };

    /*
        List all tickets from the database to one spesific event.
    */

    listTickets = () => {
        console.log(EventStore.currentEvent.eventID);
        TicketStore.getAllTicketsForEvent( EventStore.currentEvent.eventID, () => {
            this.setState(
                { ticketList : TicketStore.allTicketsCurrentEvent})
        });
        console.log(this.state.ticketList, );
    };

    /*
        Deletes ticket in the database and nd notifies the user
        with an alert message.
    */

    deleteTicket = (event) => {
        console.log('Button clicked');
        console.log(EventStore.currentEvent.eventID);
        console.log(event.target.id);
        TicketStore.deleteTicket(EventStore.currentEvent.eventID, event.target.id, statusCode => {
            if (statusCode === 200){
                alert("Billetten ble slettet!");
                this.listTickets();
            }
            else{
                alert("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!");
            }
        }).then(r => console.log('done'));

    }

}

