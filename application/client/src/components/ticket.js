import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import {TicketType} from "../classes/ticketType";
import { FaCalendar } from 'react-icons/fa';



/* Component to add tickets to concert*/

export class GetTicket extends Component{
    tickets = TicketType.getTestTicketTypes();

    render() {
        return(
            <Card>
                <Card.Body>
                    {this.tickets.map(ticket => (
                    <Form key={ticket.ticketTypeID}>
                        <Form.Row className="ticketStyle" >
                            <Col sm={2}>
                                <Form.Control value={ticket.ticketTypeID}/>
                            </Col>
                            <Col sm={2}>
                                <Form.Control value={ticket.price}/>
                            </Col>
                            <Col sm={2}>
                                <Form.Control value={ticket.amount}/>
                            </Col>
                            <Col sm={2}>
                                <Form.Control value={ticket.releaseDate}/>
                            </Col>
                            <Col>
                                <h5><FaCalendar/></h5>
                            </Col>
                            <Col sm={2}>
                                <Form.Control value={ticket.releaseTime}/>
                            </Col>

                        </Form.Row>
                        <Form.Row className="ticketStyle">
                            <Col sm={6}>
                                <Form.Control value={ticket.description}/>
                            </Col>
                        </Form.Row>
                        <Form.Row className="ticketStyle">
                            <Col>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Legg til denne billetten"
                                    key={ticket.ticketTypeID}
                                />
                            </Col>

                        </Form.Row>

                    </Form>
                    ))}
                </Card.Body>
            </Card>
        );
    }
}

export class AddTicket extends Component{


    handleChanges = {

    };


    saveTicket = event =>{
        //this.ticket = event.target.value
        console.log('Ticket Saved')
    };

    render() {
        return (
            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            <Button variant="primary" size="sm">
                                + Lag ny billett
                            </Button>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Form>
                                <Form.Row className="ticketStyle">
                                    <Col sm={2}>
                                        <Form.Control placeholder="Navn"/>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Control placeholder="Pris,-"/>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Control placeholder="Antall"/>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Control placeholder="Dato"
                                        onChange={this.saveTicket}/>
                                    </Col>
                                    <Col sm={1}>
                                        <Form.Control placeholder="14:00"/>
                                    </Col>
                                    <Col>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            label="Slutt dato?"
                                        />
                                    </Col>
                                </Form.Row>
                                <Form.Row className="ticketStyle">
                                    <Col sm={6}>
                                        <Form.Control placeholder="Beskrivelse"/>
                                    </Col>
                               </Form.Row>
                                <Button variant="primary" size="sm" onClick={this.saveTicket}>
                                    Lagre billett
                                </Button>
                            </Form>

                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>

        );
    }
}
