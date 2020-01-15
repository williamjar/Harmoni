import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Button, Card,ButtonGroup, Col, Dropdown, DropdownButton, ListGroup, Row, Tab} from "react-bootstrap";
import {FaAngleDown} from "react-icons/fa";
import {EventView} from "./eventView";
import {Event} from "../../../classes/event";
import {Search} from "../search";
import {EventStore} from "../../../store/eventStore";
import {CookieStore} from "../../../store/cookieStore";


// Component displaying all of the users events
export class Dashboard extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            active: "all",
            events: [],
        };
    }

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

    componentDidMount() {
        EventStore.storeAllEventsForOrganizer(() => {this.setState({events: EventStore.allEventsForOrganizer})}, CookieStore.currentUserID);
    }

    render() {

        return(
            <Card className={"border-0 justify-content-md-center m-4"}>
                <h3 className={"mt-4 mb-4"}>Arrangementer</h3>
                <Search searchHandler={this.searchHandler}/>
                <Row className="filterMenu">
                        <Col>
                            <ButtonGroup size="sm">
                                <Button name="all" variant="secondary" active={this.state.active === "all"} onClick={this.filterEvents}>Alle</Button>
                                <Button name="planned" variant="secondary" active={this.state.active === "planned"} onClick={this.filterEvents}>Planlagte</Button>
                                <Button name="planning" variant="secondary" active={this.state.active === "planning"} onClick={this.filterEvents}>Under planlegging</Button>
                                <Button name="archived" variant="secondary" active={this.state.active === "archived"} onClick={this.filterEvents}>Arkiverte</Button>
                            </ButtonGroup>

                            <DropdownButton size="sm" variant="info" title="Sorter etter..">
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
                            {console.log(EventStore.allEventsForOrganizer)}
                            <EventView events={this.state.events.filter(event => event.status === 1)}/>
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
                            <EventView events={this.state.events.filter(event => event.status === 0)}/>
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
                            <EventView events={this.state.events.filter(event => event.status === 2)}/>
                        </Row>
                    </Accordion.Collapse>
                </Accordion>
            </Card>
        )
    }

    searchHandler(){

    }
}