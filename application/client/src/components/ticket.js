import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";


/* Component to add tickets to concert*/
export class AddTicket extends Component{

    handleChanges = {
        console
    }


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
                                        <label>Navn billett</label>
                                        <Form.Control placeholder="Navn"/>
                                    </Col>
                                    <Col sm={1}>
                                        <label>Pris</label>
                                        <Form.Control placeholder="kr,-"/>
                                    </Col>
                                    <Col sm={1}>
                                        <label>Antall billetter</label>
                                        <Form.Control placeholder="Antall"/>
                                    </Col>
                                    <Col sm={1}>
                                        <label>Slipp dato</label>
                                        <Form.Control placeholder="10/10/20"
                                        onChange={this.saveTicket}/>
                                    </Col>
                                    <Col sm={1}>
                                        <label>Klokkeslett</label>
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
