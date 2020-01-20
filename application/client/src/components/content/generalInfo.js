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

    };

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-7 border-right">
                        <InfoForm/>
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
                        <Card className="mb-2 border-0">
                            <Card.Title>Legg til billetter</Card.Title>
                            <Ticket/>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

// Component for editing or submitting general info about an event
export class InfoForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            edit: true,
            eventName: EventStore.currentEvent.eventName,
            startDate: EventStore.currentEvent.startDate,
            endDate: EventStore.currentEvent.endDate,
            startTime: EventStore.currentEvent.startTime,
            endTime: EventStore.currentEvent.endTime,
            address: EventStore.currentEvent.address,
            zipCode: EventStore.currentEvent.zipCode,
            town: EventStore.currentEvent.town,
            description: EventStore.currentEvent.description,
            savingInformation: false,
            dateError: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    // Updates the state and the event store object when form input is changed
    handleChange(event){
        this.setState({savingInformation:false});
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value,});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }


    render() {

        if(this.state.edit){
        return(
            <div>
                <Card className="mb-2 border-0">
                    <Form onSubmit={this.handleSubmit}>
                    <Card.Body>
                        <Row>
                            <Col xs="4">
                                {this.state.edit === false ? <Card.Title>
                                    {this.state.eventName}
                                </Card.Title> : <Form.Control type="text" value={this.state.eventName} name="eventName" onChange={this.handleChange}/>}
                            </Col>
                            <Col>

                            </Col>
                        </Row>
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
                            <Form.Text hidden={!this.state.dateError} className={"text-danger"}>Arrangementet kan ikke starte etter det har sluttet!</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Button type="submit" variant="primary">Lagre</Button>
                        </Form.Group>
                    </Card.Body>

                    </Form>
                </Card>
            </div>
        )}
        else{
            return (
                <div>
                    <Card className="mb-2 border-0">
                        <Card.Title className={"h3"}>{EventStore.currentEvent.eventName}</Card.Title>
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
                                                <Form.Label>Kategori:</Form.Label>
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
                                                    {EventStore.currentEvent.description}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="success" onClick={() => this.editMode()}>Rediger</Button>
                            </Form.Group>
                        </Card.Body>

                    </Card>

                </div>
            );
        }
    }


    validateForm(){

        console.log("startdato" + this.state.startDate + "sluttdato" + this.state.endDate);
        if(this.state.startDate===this.state.endDate){
            return this.state.startTime < this.state.endTime;
        }

        return this.state.startDate < this.state.endDate;
    }

    editMode(){
        console.log("edit er sant");
        this.setState({edit:true});
    }


    submitForm(){
        this.setState({dateError: false})
        if(this.validateForm()){
            this.save();
            EventStore.editCurrentEvent().then(console.log("Lagret"));
            this.setState({edit:false});
        } else{
            this.setState({dateError: true})
        }
    }

    save(){
            EventStore.currentEvent.eventName = this.state.eventName;
            EventStore.currentEvent.startDate = this.state.startDate;
            EventStore.currentEvent.endDate = this.state.endDate;
            EventStore.currentEvent.startTime = this.state.startTime;
            EventStore.currentEvent.endTime = this.state.endTime;
            EventStore.currentEvent.address = this.state.address;
            EventStore.currentEvent.zipCode = this.state.zipCode;
            EventStore.currentEvent.town = this.state.town;
            EventStore.currentEvent.description = this.state.description;
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


