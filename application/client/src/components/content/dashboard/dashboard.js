import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Accordion,
    Button,
    Card,
    ButtonGroup,
    Col,
    Dropdown,
    DropdownButton,
    Row,
    Table
} from "react-bootstrap";
import {FaAngleDown, FaPlusCircle} from "react-icons/fa";
import {EventView} from "./eventView";
import {Search} from "../search";
import {EventStore} from "../../../store/eventStore";
import {CookieStore} from "../../../store/cookieStore";
import {createHashHistory} from "history";
import {RiderStore} from "../../../store/riderStore";
import {OrganizerStore} from "../../../store/organizerStore";

const history = createHashHistory();


// Component displaying all of the users events
export class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            events: [],
        };
    }

    // Method for filtering the organizer's events by status -> NOT IMPLEMENTED YET
    filterEvents = (e) => {
        this.setState({active: e.target.name});

        if (this.state.active === "all") {

        } else if (this.state.active === "planning") {

        } else if (this.state.active === "published") {

        } else if (this.state.active === "archived") {

        } else if (this.state.active === "cancelled") {

        }
    };

    // Sends the user to create event screen when clicking the "plus"-button
    addEventClicked = () => {
        history.push("/opprett")
    };

    // Stores all the organizer's events before rendering the page
    componentDidMount() {
        EventStore.storeAllEventsForOrganizer(() => {
            this.setState({events: EventStore.allEventsForOrganizer})
        }, CookieStore.currentUserID);
    }

    render() {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, statusCode => {
            OrganizerStore.archiveOldEvents();
        });
        return (
            <Card className={"border-0 justify-content-md-center m-4"}>
                <h3 className={"mt-4 mb-4"}>Arrangementer</h3>
                <Search searchHandler={this.searchHandler} results={this.state.events}/>
                <Row className="filterMenu">
                    <Col>
                        <ButtonGroup size="sm">
                            <Button name="all" variant="secondary" active={this.state.active === "all"}
                                    onClick={this.filterEvents}>Alle</Button>
                            <Button name="planning" variant="secondary" active={this.state.active === "planning"}
                                    onClick={this.filterEvents}>Under Planlegging</Button>
                            <Button name="published" variant="secondary" active={this.state.active === "published"}
                                    onClick={this.filterEvents}>Publisert</Button>
                            <Button name="archived" variant="secondary" active={this.state.active === "archived"}
                                    onClick={this.filterEvents}>Arkiverte</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Kansellerte</Button>
                        </ButtonGroup>

                        <DropdownButton size="sm" variant="info" title="Sorter etter..">
                            <Dropdown.Item as="button">Dato</Dropdown.Item>
                            <Dropdown.Item as="button">Pris</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                </Row>

                <Accordion id="publishedEvents" defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Publisert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {console.log(EventStore.allEventsForOrganizer)}
                            {this.state.events.filter(e => e.status === 1).length > 0 ?
                                <EventView events={this.state.events.filter(event => event.status === 1)}/> :
                                <NoEvents message="Du har ingen planlagte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion id="plannedEvents" defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Under planlegging</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.events.filter(e => e.status === 0).length > 0 ?
                                <EventView events={this.state.events.filter(event => event.status === 0)}/> :
                                <NoEvents message="Du har ingen arrangement under planlegging"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion id="archivedEvents" defaultActiveKey="1">
                    <Row className="no-gutters">
                        <p>Arkivert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.events.filter(e => e.status === 2).length > 0 ?
                                <EventView events={this.state.events.filter(event => event.status === 2)}/> :
                                <NoEvents message="Du har ingen arkiverte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion id="cancelledEvents" defaultActiveKey="1">
                    <Row className="no-gutters">
                        <p>Kansellert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.events.filter(e => e.status === 3).length > 0 ?
                                <EventView events={this.state.events.filter(event => event.status === 3)}/> :
                                <NoEvents message="Du har ingen kansellerte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Row>
                    <Col className="pull-right" size={12}>
                        <div onClick={this.addEventClicked} align="right">
                            <FaPlusCircle className="ml-2" size={60}/>
                        </div>
                    </Col>
                </Row>
            </Card>
        )
    }

    searchHandler(event) {
        console.log("Event received");
        console.log(event);

        //TODO: may need to sett current event in event store perhaps and maybe some other variables?
        EventStore.currentEvent = event;
        RiderStore.storeAllRidersForEvent(() => {
            console.log("Here comes the sun, nananana");
            console.log(RiderStore.allRidersForCurrentEvent);
            history.push("/arrangementEdit/" + this.props.event.eventID);
        }, event.eventID);
        history.push(`/arrangementEdit/${event.eventID}`);
    }
}

// Component for displaying a feedback message if there is no events
export class NoEvents extends Component {
    render() {
        return (
            <Table className="mb-4" striped>
                <tbody>
                <tr>
                    <td>{this.props.message}</td>
                </tr>
                </tbody>
            </Table>
        )
    }
}