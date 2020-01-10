import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Form, Image, Row} from "react-bootstrap";
import {FaCalendarAlt, FaClock, FaPencilAlt, FaHouseDamage} from "react-icons/fa";
import lorde from './lorde.jpg';
import map from './map.jpg';
import {GetTicket} from "../ticket";


export class GeneralInfo extends Component{

    state = {
        editable: [this.props.editable],
    };

    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-7 border-right">
                        {this.state.editable === true ? <InfoForm/> : <InfoView/>}
                    </div>
                    <div className="col-5">
                        <Card.Body>
                            <Image src={lorde} alt="event image" fluid className="mb-2"/>
                            {this.state.editable === true ? <Button>Last opp bilde</Button> : null}
                        </Card.Body>
                    </div>
                </div>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>Billetter</Form.Label>
                        <GetTicket/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export class InfoForm extends Component {

    state = {
        edit: false,
        name: "Lorde, intimkonsert",
    };

    editClicked = () => {
        this.setState({edit: true})
    };

    saveClicked = (e) => {
        this.setState({edit: false})
    };

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        this.setState({edit: true, name: [value]})
    };

    render() {
        return(
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        <Row>
                            <Col xs="4">
                                {this.state.edit === false ? <Card.Title>
                                    {this.state.name}
                                </Card.Title> : <Form.Control type="text" value={this.state.name} onChange={this.handleChange}/>}
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

export class InfoView extends Component {

    state = {
        edit: false,
        name: "Lorde, intimkonsert",
    };

    editClicked = () => {
        this.setState({edit: true})
    };

    render() {
        return(
            <div>
                <Card className="mb-2">
                    <Card.Header>
                        <Row>
                            <Card.Title>Lorde, intimkonsert</Card.Title>
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
                                    01 Jan 2020
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    18:00
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
                                    01 Jan 2020
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                        </Col>
                                    </Row>
                                    21:00
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
                                    Trondheim Spektrum
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Postnummer</Form.Label>
                                        </Col>
                                    </Row>
                                    7014
                                </Col>
                                <Col xs="3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Poststed</Form.Label>
                                        </Col>
                                    </Row>
                                    Trondheim
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
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer a tempor est,
                                        non pharetra diam. Nullam nulla nunc, malesuada quis cursus at, imperdiet
                                        pellentesque nisl. Duis eget nulla eu ante congue tincidunt. Sed tristique odio
                                        massa, ac suscipit odio lobortis ac. Sed fringilla tempor nulla, nec feugiat
                                        augue hendrerit sit amet.
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