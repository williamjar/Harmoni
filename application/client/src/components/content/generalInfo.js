import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Col, Form, Row} from "react-bootstrap";
import {FaCalendarAlt, FaClock, FaPencilAlt, FaHouseDamage} from "react-icons/fa";


export class GeneralInfo extends Component{
    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-7 border-right">
                        <InfoForm/>
                    </div>

                    <div className="col-6">

                    </div>
                </div>
            </div>
        )
    }
}

export class InfoForm extends Component {
    render() {
        return(
            <div>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            Lorde, intimkonsert {<FaPencilAlt className="ml-1"/>}
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group>
                            <Row className="mb-2">
                                <Col xs="5">
                                    <FaCalendarAlt className="mr-1"/>
                                    <Form.Label>Start</Form.Label>
                                    <Form.Control type="date"/>
                                </Col>
                                <Col xs="3">
                                    <FaClock className="mr-1"/>
                                    <Form.Label>Tid</Form.Label>
                                    <Form.Control type="time"/>
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
                                    <Form.Control type="date"/>
                                </Col>
                                <Col xs="3">
                                    <FaClock className="mr-1"/>
                                    <Form.Label>Tid</Form.Label>
                                    <Form.Control type="time"/>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col xs="5">
                                    <FaHouseDamage className="mr-1"/>
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type="text"/>
                                </Col>
                                <Col xs="3">
                                    <Form.Label>Postnummer</Form.Label>
                                    <Form.Control type="text"/>
                                </Col>
                                <Col xs="3">
                                    <Form.Label>Poststed</Form.Label>
                                    <Form.Control type="text"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Label>Beskrivelse</Form.Label>
                                    <Form.Control as="textarea" rows="3"/>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}