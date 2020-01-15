import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Form, Image, Row} from "react-bootstrap";
import {FaCalendarAlt, FaClock, FaPencilAlt, FaHouseDamage} from "react-icons/fa";
import lorde from './lorde.jpg';
import placeholder from './placeholder.jpg'
import map from './map.jpg';
import {GetTicket, Ticket, TicketView} from "../ticket";
import {eventStore} from "../../store/eventStore";
import {createHashHistory} from "history";

const history = createHashHistory();

// Component for viewing general information about an event
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
                            <Image src={eventStore.currentEvent.picture != null ? lorde : placeholder} alt="event image" fluid className="mb-2"/>
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
            eventName: eventStore.currentEvent.eventName,
            startDate: eventStore.currentEvent.startDate,
            endDate: eventStore.currentEvent.endDate,
            startTime: eventStore.currentEvent.startTime,
            endTime: eventStore.currentEvent.endTime,
            address: eventStore.currentEvent.address,
            zipCode: eventStore.currentEvent.zipCode,
            town: eventStore.currentEvent.town,
            description: eventStore.currentEvent.description
        };

        this.handleChange = this.handleChange.bind(this);

    }

    editClicked = () => {
        this.setState({edit: true})
    };

    saveClicked = (e) => {
        this.setState({edit: false})
    };


    handleChange (event) {
        this.setState({[event.target.name]: event.target.value},
            () => {
                eventStore.currentEvent.eventName = this.state.eventName;
                eventStore.currentEvent.startDate = this.formatDate(this.state.startDate);
                eventStore.currentEvent.endDate   = this.formatDate(this.state.endDate);
                eventStore.currentEvent.startTime = this.state.startTime;
                eventStore.currentEvent.endTime   = this.state.endTime;
                eventStore.currentEvent.address   = this.state.address;
                eventStore.currentEvent.zipCode   = this.state.zipCode;
                eventStore.currentEvent.town      = this.state.town;
                eventStore.currentEvent.description = this.state.description;
                eventStore.currentEvent.publishDate = null;
                eventStore.currentEvent.publishTime = null;
            });
    };

    render() {

        // Formatted date to fit into default value of datepicker

        let startDate = new Date(this.state.startDate);
        let endDate = new Date(this.state.endDate);
        let startMonth = "";
        let endMonth = "";
        let startDay = "";
        let endDay = "";

        if(startDate.getMonth() <= 8) {
            startMonth = "0" + (startDate.getMonth() + 1);
        } else {
            startMonth = startDate.getMonth() + 1;
        }

        if(endDate.getMonth() <= 8) {
            endMonth = "0" + (endDate.getMonth() + 1);
        } else {
            endMonth = startDate.getMonth() + 1;
        }

        if(startDate.getDate() > 9) {
            startDay = startDate.getDate();
        } else {
            startDay = "0" + startDate.getDate();
        }

        if(endDate.getDate() > 9) {
            endDay = endDate.getDate();
        } else {
            endDay = "0" + endDate.getDate();
        }

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
                                    <Form.Control type="date" value={startDate.getFullYear() + "-" + startMonth + "-" + startDay} name="startDate" onChange={this.handleChange}/>
                                </Col>
                                <Col xs="3">
                                    <FaClock className="mr-1"/>
                                    <Form.Label>Tid</Form.Label>
                                    <Form.Control type="time" value={this.state.startTime} name="startTime" onChange={this.handleChange}/>
                                </Col>
                                <Col>
                                    <Form.Label>Type arrangement</Form.Label>
                                    <Form.Control as="select">
                                        <option>Musikk</option>
                                        <option>Sportsarrangement</option>
                                        <option>Teater</option>
                                    </Form.Control>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <FaCalendarAlt className="mr-1"/>
                                    <Form.Label>Slutt</Form.Label>
                                    <Form.Control type="date" value={endDate.getFullYear() + "-" + endMonth + "-" + endDay} name="endDate" onChange={this.handleChange}/>
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

    state = {
        edit: false,
        name: "Lorde, intimkonsert",
    };

    editClicked = () => {
        this.setState({edit: true})
    };

    render() {

        let options = {year: 'numeric', month: 'long', day: 'numeric'};

        return(
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        <Row>
                            <Card.Title>{eventStore.currentEvent.eventName}</Card.Title>
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
                                    {eventStore.currentEvent.startDate !== null ?
                                        new Date(eventStore.currentEvent.startDate).toLocaleDateString("no-NO", options) :
                                    null}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    {eventStore.currentEvent.startTime}
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
                                    {eventStore.currentEvent.endDate !== null ?
                                        new Date(eventStore.currentEvent.endDate).toLocaleDateString("no-NO", options) :
                                        null}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    {eventStore.currentEvent.endTime}
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
                                    {eventStore.currentEvent.address}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Postnummer</Form.Label>
                                        </Col>
                                    </Row>
                                    {eventStore.currentEvent.zipCode}
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Poststed</Form.Label>
                                        </Col>
                                    </Row>
                                    {eventStore.currentEvent.town}
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
                                        {eventStore.currentEvent.description}
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}