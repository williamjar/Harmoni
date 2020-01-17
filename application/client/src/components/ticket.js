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
    Component to share all the ticket components
*/
export class Ticket extends Component{
    render(){
        return(
            <Card>
                <Form>
                    <ListTickets/>
                </Form>
                <Form>
                    <AddTicket/>
                </Form>

            </Card>
        );

    }
}

/*
    Component to add new tickets to an event.
 */
export class AddTicket extends Component{

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

    handleSubmit(event){
        event.preventDefault();
        TicketStore.addTicket(EventStore.currentEvent.eventID,
                                    this.state.ticketTypeName, this.state.price, this.state.amount,
                                    this.state.releaseDate, this.state.releaseTime, this.state.endDate,
                                    this.state.endTime, this.state.description);
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
}

/*
    Component to list all tickets in an event.
*/
export class ListTickets extends Component{

    constructor(props) {
        super(props);
        this.state = {
            ticketList : []
        };
    }

    render(){
            return(
                <Card.Body>
                    <ListGroup>
                        {this.state.ticketList.map(ticket => (
                            <ListGroup.Item>
                                <Form>
                                    <Form.Row className="ticketStyle" >
                                        <Col sm={2}>
                                            <Form.Control
                                                value={ticket.ticketTypeName}
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
                                    <Form.Row className="ticketStyle">
                                        <Col sm={6}>
                                            <button id={ticket.ticketTypeID} onClick={this.deleteTicket}>Slett billett</button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card.Body>
            );
    }
    componentDidMount() {
        this.listTickets();
    }

    listTickets = () => {
        console.log(EventStore.currentEvent.eventID);
        TicketStore.getAllTickets( EventStore.currentEvent.eventID, () => {
            this.setState(
                { ticketList : TicketStore.allTickets})
        });
        console.log(this.state.ticketList, );
    };

    deleteTicket = (event) => {
        console.log('Button clicked');
        console.log(EventStore.currentEvent.eventID);
        console.log(event.target.id);
        TicketStore.deleteTicket(EventStore.currentEvent.eventID, event.target.id).then(r => console.log('done'));

    }






}

/*
    Component for viewing all types of tickets associated with the event.
 */
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

