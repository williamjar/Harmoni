import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import {TicketType} from "../classes/ticketType";
import { FaCalendar } from 'react-icons/fa';
import ListGroup from "react-bootstrap/ListGroup";
import {Table} from "react-bootstrap";
import {FaAngleDown} from "react-icons/all";



export class Ticket extends Component{
    render(){
        return(
            <Card>
                <Form>
                    <ListTickets/>
                </Form>
                <Form>
                    <GetTicket/>
                </Form>

            </Card>
        );

    }
}

/*Component to retrive tickets from the database*/

export class GetTicket extends Component{

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
            description : ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        event.preventDefault();
        console.log('Ticket Saved' + ' ' + 'this: ' + this.state.price);

    };

    handleInputChange(event) {
        console.log(this.state.ticketTypeName);
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        console.log(name + " verdi: " + value);
        this.setState({[name]: value,});

    }


    render() {
        return(
                <Card.Body>
                    <Accordion>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                + Lag ny billett
                        </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Row className="ticketStyle">
                                    <Col>
                                        <Form.Control
                                            name = "ticketTypeName"
                                            placeholder = "Navn"
                                            value = {this.state.ticketTypeName}
                                            onChange = {this.handleInputChange}

                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            name = "price"
                                            placeholder="Pris,-"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.price}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            name = "amount"
                                            placeholder="Antall"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.amount}

                                        />

                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type = "date"
                                            name = "releaseDate"
                                            onChange={this.handleInputChange}
                                            value = {this.state.releaseDate}
                                        />

                                    </Col>
                                    <Col>
                                        <Form.Control
                                            type ="date"
                                            name = "endDate"
                                            onChange={this.handleInputChange}
                                            value = {this.state.endDate}

                                        />
                                    </Col>
                                    <Col >
                                        <Form.Control
                                            type = "time"
                                            name = "releaseTime"
                                            onChange={this.handleInputChange}
                                            value = {this.state.releaseTime}
                                        />
                                    </Col>
                                    <Col >
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
                                        <Form.Control
                                            name = "description"
                                            placeholder="Beskrivelse"
                                            onChange={this.handleInputChange}
                                            value = {this.state.description}
                                        />
                                    </Col>
                                </Form.Row>
                                <Button variant="primary" size="sm" type="submit" onClick={this.handleSubmit}>
                                    Lagre billett
                                </Button>
                            </Form>
                        </Card.Body>
                     </Accordion.Collapse>
                    </Accordion>
                </Card.Body>
        );
    }
}

/* Component to add tickets to the concert*/
export class ListTickets extends Component{

    tickets = TicketType.getTestTicketTypes();

    render(){
        return(
                <Card.Body>
                    <ListGroup>
                        {this.tickets.map(ticket =>(
                            <ListGroup.Item>
                                <Form>
                                    <Form.Row className="ticketStyle" >
                                        <Col sm={2}>
                                            <Form.Control
                                                value={ticket.ticketTypeID}
                                                readOnly
                                            />

                                        </Col>
                                        <Col sm={1}>
                                            <Form.Control
                                                value={ticket.price}
                                                readOnly
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Control
                                                value={ticket.amount}
                                                readOnly
                                            />
                                        </Col>
                                        <Col sm={2}>
                                            <Form.Control
                                                value={ticket.releaseDate}
                                                readOnly
                                            />
                                        </Col>

                                        <Col sm={2}>
                                            <Form.Control
                                                value={ticket.endDate}
                                                readOnly
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Form.Control
                                                value={ticket.releaseTime}
                                                readOnly
                                            />
                                        </Col>
                                        <Col sm={1}>
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
                                            <Form.Control
                                                value={ticket.description}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
        );
    }
}

// Component for viewing all types of tickets associated with the event
export class TicketView extends Component {

    state = {
        collapse: true
    };

    collapse = (e) => {
        if(this.state.collapse) {
            this.setState({collapse: false})
        } else {
            this.setState({collapse: true})
        }
    };

    render() {
        return(
            <Table striped>
                <thead>
                <tr align="center">
                    <th>Billettype</th>
                    <th>Pris</th>
                    <th>Antall</th>
                    <th>Slippdato</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr align='center' onClick={this.collapse}>
                    <td>Standard</td>
                    <td>200kr</td>
                    <td>1000</td>
                    <td>01 JAN 2020</td>
                    <td><FaAngleDown/></td>
                </tr>
                <tr className={this.state.collapse ? "collapse" : null}>
                    beskrivelse
                </tr>
                <tr align='center' className="accordion">
                    <td>GULL</td>
                    <td>500kr</td>
                    <td>500</td>
                    <td>01 JAN 2020</td>
                    <td><FaAngleDown/></td>
                </tr>
                <tr className={this.state.collapse ? "collapse" : null}>
                    beskrivelse
                </tr>
                <tr align='center' className="accordion">
                    <td>VIP</td>
                    <td>1000kr</td>
                    <td>100</td>
                    <td>01 JAN 2020</td>
                    <td><FaAngleDown/></td>
                </tr>
                <tr className={this.state.collapse ? "collapse" : null}>
                    beskrivelse
                </tr>
                </tbody>
            </Table>
        )
    }
}

