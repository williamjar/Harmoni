import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Button, ButtonGroup, Col, Dropdown, DropdownButton, ListGroup, Row, Tab} from "react-bootstrap";
import {FaAngleDown} from "react-icons/fa";
import {EventView} from "./eventView";
import {Event} from "../../../classes/event";
import {Search} from "../search";
import {eventStore} from "../../../store/eventStore";

// Component displaying all of the users events
export class Dashboard extends React.Component {

    state = {
        active: "all"
    };

    filterEvents = (e) => {
        this.setState({active: e.target.name});

        if(this.state.active === "all") {

        }
        else if(this.state.active === "planned") {

        }
        else if(this.state.active === "planning") {

        }
        else if(this.state.active === "archived") {

        }
    };

    render() {

        const testEvent = Event.getTestEvents()[0];

        return(
            <div>
                <Search searchHandler={this.searchHandler}/>
                <h3>Arrangementer</h3>
                    <Row className="filterMenu">
                        <Col>
                            <ButtonGroup size="md">
                                <Button name="all" variant="secondary" active={this.state.active === "all"} onClick={this.filterEvents}>Alle</Button>
                                <Button name="planned" variant="secondary" active={this.state.active === "planned"} onClick={this.filterEvents}>Planlagte</Button>
                                <Button name="planning" variant="secondary" active={this.state.active === "planning"} onClick={this.filterEvents}>Under planlegging</Button>
                                <Button name="archived" variant="secondary" active={this.state.active === "archived"} onClick={this.filterEvents}>Arkiverte</Button>
                            </ButtonGroup>
                        </Col>
                        <Col>
                            <DropdownButton title="Sorter etter..">
                                <Dropdown.Item as="button">Dato</Dropdown.Item>
                                <Dropdown.Item as="button">Pris</Dropdown.Item>
                            </DropdownButton>
                        </Col>
                    </Row>
                <Accordion id="plannedEvents" defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Planlagte arrangement</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {eventStore.allEventsForOrganizer.map(event => (
                                <p>{event.eventName}</p>
                            ))}
                            <EventView event1={testEvent}/>
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
                            <EventView event1={testEvent}/>
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
                            <EventView event1={testEvent}/>
                        </Row>
                    </Accordion.Collapse>
                </Accordion>
            </div>
        )
    }

    componentDidMount() {
        eventStore.storeAllEventsForOrganizer(2);
        console.log(eventStore.allEventsForOrganizer);
    }

    searchHandler(){

    }
}