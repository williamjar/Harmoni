import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Button, Col, Dropdown, DropdownButton, ListGroup, Row, Tab} from "react-bootstrap";
import {FaAngleDown} from "react-icons/fa";
import {EventView} from "./eventView";

// Component displaying all of the users events
export class Dashboard extends React.Component {

    status = "alle";

    render() {

        return(
            <div>
                <h3>Arrangementer</h3>
                    <Row className="filterMenu">
                        <Col>
                            <ListGroup horizontal="md" >
                                <ListGroup.Item action href="#alle" active>Alle</ListGroup.Item>
                                <ListGroup.Item action href="#alle">Planlagte</ListGroup.Item>
                                <ListGroup.Item action href="#alle">planlegges</ListGroup.Item>
                                <ListGroup.Item action href="#alle">Arkiverte</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col>
                            <DropdownButton title="Sorter etter..">
                                <Dropdown.Item as="button">Dato</Dropdown.Item>
                                <Dropdown.Item as="button">Pris</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                <Accordion defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Planlagte arrangement</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            <EventView/>
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Under planlegging</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            <EventView/>
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Arkiverte</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            <EventView/>
                        </Row>
                    </Accordion.Collapse>
                </Accordion>
            </div>



        )
    }
}