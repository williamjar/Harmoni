import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Form, Image, Row} from "react-bootstrap";
import {FaCalendarAlt, FaClock, FaPencilAlt, FaHouseDamage} from "react-icons/fa";
import lorde from './lorde.jpg';
import placeholder from './placeholder.jpg'
import {Ticket, TicketView} from "../ticket";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";

const history = createHashHistory();

// Component for viewing or editing the general info about an event
// The component changes if the event is in "edit mode" or not
export class GeneralInfo extends Component{

    state = {
        editable: [this.props.editable],
    };

    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-7 border-right">
                        {this.state.editable ? <InfoForm/> : <InfoView/>}
                    </div>
                    <div className="col-5">
                        <Card.Body>
                            <Image src={EventStore.currentEvent.picture != null ? lorde : placeholder} alt="event image" fluid className="mb-2"/>
                            {this.state.editable ? <Button>Last opp bilde</Button> : null}
                        </Card.Body>
                    </div>
                </div>
                <Row className="mb-3">
                    <Col>
                        <Card>
                            <Card.Header><Card.Title>Billetter</Card.Title></Card.Header>
                            {this.state.editable ? <Ticket/> : <TicketView/>}
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }

    // Updates the state if the received props from the parent is changed
    static getDerivedStateFromProps(props, state) {

        if(props.editable !== state.editable) {
            return {
                editable: props.editable
            };
        } else if (props.event !== state.currentEvent) {
            return {
                currentEvent: props.event
            }
        }
        return null;
    }
}

// Component for editing or submitting general info about an event
export class InfoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            eventName: EventStore.currentEvent.eventName,
            startDate: EventStore.currentEvent.startDate,
            endDate: EventStore.currentEvent.endDate,
            startTime: EventStore.currentEvent.startTime,
            endTime: EventStore.currentEvent.endTime,
            address: EventStore.currentEvent.address,
            zipCode: EventStore.currentEvent.zipCode,
            town: EventStore.currentEvent.town,
            description: EventStore.currentEvent.description,
        };

        this.handleChange = this.handleChange.bind(this);

    }

    // Handles when the user wants to edit the event name,
    // when edit = true, the name label is changed to an input field
    editClicked = () => {
        this.setState({edit: true})
    };

    // Handles when the user saves the new name
    saveClicked = (e) => {
        this.setState({edit: false})
    };

    // Updates the state and the event store object when form input is changed
    handleChange (event) {
        this.setState({[event.target.name]: event.target.value},
            () => {
                EventStore.currentEvent.eventName = this.state.eventName;
                EventStore.currentEvent.startDate = this.formatDate(this.state.startDate);
                EventStore.currentEvent.endDate   = this.formatDate(this.state.endDate);
                EventStore.currentEvent.startTime = this.state.startTime;
                EventStore.currentEvent.endTime   = this.state.endTime;
                EventStore.currentEvent.address   = this.state.address;
                EventStore.currentEvent.zipCode   = this.state.zipCode;
                EventStore.currentEvent.town      = this.state.town;
                EventStore.currentEvent.description = this.state.description;
                EventStore.currentEvent.publishDate = null;
                EventStore.currentEvent.publishTime = null;
            });
    };

    render() {
        return(
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        <Row>
                            <Col xs="4">
                                {this.state.edit === false ? <Card.Title>
                                    {this.state.eventName}
                                </Card.Title> : <Form.Control type="text" value={this.state.eventName} name="eventName" onChange={this.handleChange}/>}
                            </Col>
                            <Col>
                                {this.state.edit === false ? <FaPencilAlt className="ml-1" onClick={this.editClicked}/>:
                                    <Button type="submit" onClick={this.saveClicked}>Lagre</Button>}
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Row className="mb-2">
                                <Col xs="5">
                                    <FaCalendarAlt className="mr-1"/>
                                    <Form.Label>Start</Form.Label>
                                    <Form.Control type="date" value={this.formatDate(this.state.startDate)} name="startDate" onChange={this.handleChange}/>
                                </Col>
                                <Col xs="3">
                                    <FaClock className="mr-1"/>
                                    <Form.Label>Tid</Form.Label>
                                    <Form.Control type="time" value={this.state.startTime} name="startTime" onChange={this.handleChange}/>
                                </Col>
                                <Col>
                                    <Form.Label>Type arrangement</Form.Label>
                                    <Form.Control as="select">
                                        <option value={1}>Konsert</option>
                                        <option value={2}>Festival</option>
                                        <option value={3}>Konkurranse</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <FaCalendarAlt className="mr-1"/>
                                    <Form.Label>Slutt</Form.Label>
                                    <Form.Control type="date" value={this.formatDate(this.state.endDate)} name="endDate" onChange={this.handleChange}/>
                                </Col>
                                <Col xs="3">
                                    <FaClock className="mr-1"/>
                                    <Form.Label>Tid</Form.Label>
                                    <Form.Control type="time" value={this.state.endTime} name="endTime" onChange={this.handleChange}/>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <FaHouseDamage className="mr-1"/>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type="text" value={this.state.address} name="address" onChange={this.handleChange}/>
                                </Col>
                                <Col xs="3">
                                    <Form.Label>Postnummer</Form.Label>
                                    <Form.Control type="text" value={this.state.zipCode} name="zipCode" onChange={this.handleChange}/>
                                </Col>
                                <Col xs="3">
                                    <Form.Label>Poststed</Form.Label>
                                    <Form.Control type="text" value={this.state.town} name="town" onChange={this.handleChange}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Beskrivelse</Form.Label>
                                    <Form.Control as="textarea" rows="3" value={this.state.description} name="description" onChange={this.handleChange}/>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    // Converts a javascript date to a format compatible with both datepicker and mysql
    formatDate(date) {
        let d = new Date(date);
        let month = "" + (d.getMonth() + 1);
        let day = "" + (d.getDate());
        let year = d.getFullYear();

        if(month.length < 2) {
            month = "0" + month;
        }
        if(day.length < 2) {
            day = "0" + day;
        }

        return [year, month, day].join("-");
    }
}

// Component for viewing the general information about an event
export class InfoView extends Component {

    render() {
        return(
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        <Row>
                            <Card.Title>{EventStore.currentEvent.eventName}</Card.Title>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Row className="mb-2">
                                <Col xs="5">
                                    <Row>
                                        <Col>
                                            <FaCalendarAlt className="mr-1"/>
                                            <Form.Label>Start</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.startDate !== null ?
                                        this.formatDate(EventStore.currentEvent.startDate) :
                                    null}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.startTime}
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <Form.Label>Type arrangement</Form.Label>
                                        </Col>
                                    </Row>
                                    Musikk
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <Row>
                                        <Col>
                                            <FaCalendarAlt className="mr-1"/>
                                            <Form.Label>Slutt</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.endDate !== null ?
                                        this.formatDate(EventStore.currentEvent.endDate) :
                                        null}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.endTime}
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <Row>
                                        <Col>
                                            <FaHouseDamage className="mr-1"/>
                                            <Form.Label>Adresse</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.address}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Postnummer</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.zipCode}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Poststed</Form.Label>
                                        </Col>
                                    </Row>
                                    {EventStore.currentEvent.town}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Row className="mt-2">
                                        <Col>
                                            <Card.Title>Beskrivelse</Card.Title>
                                        </Col>
                                    </Row>
                                    <Card.Body>
                                        {EventStore.currentEvent.description}
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </div>
        )
    }

    // Converts the date of an event to a more readable format
    formatDate = (d) => {
        let options = {year: 'numeric', month: 'long', day: 'numeric'};
        let date = new Date(d);
        return date.toLocaleDateString("nb-NO", options);
    }
}