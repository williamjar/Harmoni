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
    Table, Form
} from "react-bootstrap";
import {FaAngleDown, FaPlusCircle} from "react-icons/fa";
import {EventView} from "./eventView";
import {Search} from "../search";
import {EventStore} from "../../../store/eventStore";
import {CookieStore} from "../../../store/cookieStore";
import {createHashHistory} from "history";
import {TicketStore} from "../../../store/ticketStore";

const history = createHashHistory();


// Component displaying all of the users events
export class Dashboard extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            active: "all",
            events: [],
            sortBy: 0,
        };
    }

    // Method for filtering the organizer's events by status -> NOT IMPLEMENTED YET
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

    // Sets what the user wants to sort by
    sortSelected = (e) => {
        this.setState({sortBy: e.target.value});
    };

    // Sends the user to create event screen when clicking the "plus"-button
    addEventClicked = () => {
        history.push("/opprett")
    };

    render() {
        return(
            <Card className={"border-0 justify-content-md-center m-4"}>
                <h3 className={"mt-4 mb-4"}>Arrangementer</h3>
                <Search searchHandler={this.searchHandler}/>
                <Row className="filterMenu mb-2 mt-2">
                        <Col>
                            <ButtonGroup size="sm">
                                <Button name="all" variant="secondary" active={this.state.active === "all"} onClick={this.filterEvents}>Alle</Button>
                                <Button name="planned" variant="secondary" active={this.state.active === "planned"} onClick={this.filterEvents}>Planlagte</Button>
                                <Button name="planning" variant="secondary" active={this.state.active === "planning"} onClick={this.filterEvents}>Under planlegging</Button>
                                <Button name="archived" variant="secondary" active={this.state.active === "archived"} onClick={this.filterEvents}>Arkiverte</Button>
                            </ButtonGroup>
                        </Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" onChange={this.sortSelected}>
                            <option selected disabled>Sorter etter..</option>
                            <option value={0}>Dato</option>
                            <option value={1}>Pris</option>
                            <option value={2}>Sted</option>
                        </Form.Control>
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
                            {this.state.events.filter(e => e.status === 1).length > 0 ?
                                <EventView events={this.sortEvents(this.state.events.filter(event => event.status === 1))}/> :
                                <NoEvents message="Du har ingen planlagte arrangement"/>}
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
                            {this.state.events.filter(e => e.status === 0).length > 0 ?
                                <EventView events={this.sortEvents(this.state.events.filter(event => event.status === 0))}/> :
                                <NoEvents message="Du har ingen arrangement under planlegging"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion defaultActiveKey="1">
                    <Row className="no-gutters">
                        <p>Arkiverte</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.events.filter(e => e.status === 2).length > 0 ?
                                <EventView events={this.sortEvents(this.state.events.filter(event => event.status === 2))}/> :
                                <NoEvents message="Du har ingen arkiverte arrangement"/>}
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

    searchHandler(){

    }

    // Sorts the events by either date, price or location
    sortEvents = (events) => {
        if(this.state.sortBy == 0) {
            return [].concat(events).sort((a,b) => {
                a = new Date(a.startDate);
                b = new Date(b.startDate);
                return a>b ? 1 : a<b ? -1 : 0;
            });
        } else if(this.state.sortBy == 1) {
            let sorted = [].concat(events).sort((a,b) => {
                let price1 = null;
                let price2 = null;
                function getPrices(callback) {
                    TicketStore.getAllTickets(a.eventID, () => price1 = Math.min.apply(Math, TicketStore.allTickets.map(ticket => {
                        return ticket.price;
                    })));
                    TicketStore.getAllTickets(b.eventID, () => price2 = Math.min.apply(Math, TicketStore.allTickets.map(ticket => {
                        return ticket.price;
                    })));
                    callback();
                }
                console.log( getPrices(() => {
                    return price1 > price2 ? 1 : price1 < price2 ? -1 : 0
                }))
            });
            console.log(events);
            console.log(sorted);
            return sorted;
        } else if(this.state.sortBy == 2) {
            return [].concat(events).sort((a,b) => {
                return (a.town > b.town ? 1 : a.town < b.town ? -1 : 0);
            });
        }
    };

    getPrice = (event) => {
        let price = null;
        return price;
    };

    // Stores all the organizer's events before rendering the page
    componentDidMount() {
        EventStore.storeAllEventsForOrganizer(() => {this.setState({events: EventStore.allEventsForOrganizer})}, CookieStore.currentUserID);
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