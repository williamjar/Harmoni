import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Accordion,
    Button,
    Card,
    ButtonGroup,
    Col,
    Row,
    Table, Form
} from "react-bootstrap";
import {FaAngleDown, FaPlusCircle} from "react-icons/fa";
import {EventView} from "./eventView";
import {Search} from "../search";
import {EventStore} from "../../../store/eventStore";
import {CookieStore} from "../../../store/cookieStore";
import {createHashHistory} from "history";
import {RiderStore} from "../../../store/riderStore";
import {OrganizerStore} from "../../../store/organizerStore";
import {Alert} from "../../alerts";

const history = createHashHistory();


/**
 * @class Dashboard
 * classdesc Component for displaying the full list of events for the organizer, sort and filtering methods.
 */
export class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            events: [],
            sortBy: 0,
            published: [],
            planning: [],
            archived: [],
            cancelled: [],
            loading : true
        };
    }

    // Method for filtering the organizer's events by status
    filterEvents = (e) => {
        this.setState({active: e.target.name});
    };


    orderByNewestEvent = (eventList, callback) => {
        let listSorted = eventList;
        if(listSorted !== null){
            listSorted.sort(function(a, b){
                let fileA = a.eventID;
                let fileB = b.eventID;
                if(fileA > fileB) { return -1; }
                if(fileA < fileB) { return 1; }
                return 0;
            })
        }
        callback(listSorted);
    };

    /*
    this.orderByTime(this.state.planning, (sortedList) => { this.setState({planning: sortedList});
    this.orderByNewestEvent(this.state.published, (sortedList) => {this.setState({published: sortedList})});
    this.orderByNewestEvent(this.state.archived, (sortedList) => {this.setState({archived: sortedList})});
    this.orderByNewestEvent(this.state.cancelled, (sortedList) => {this.setState({cancelled: sortedList})});

     */

    changeAllByTime = () => {
        this.orderByTime(this.state.planning, (sortedList) => {this.setState({planning: sortedList})});
        this.orderByTime(this.state.published, (sortedList) => {this.setState({published: sortedList})});
        this.orderByTime(this.state.archived, (sortedList) => {this.setState({archived: sortedList})});
        this.orderByTime(this.state.cancelled, (sortedList) => {this.setState({cancelled: sortedList})});
    };

    changeAllByNewest = () => {
        this.orderByNewestEvent(this.state.planning, (sortedList) => {this.setState({planning: sortedList})});
        this.orderByNewestEvent(this.state.published, (sortedList) => {this.setState({published: sortedList})});
        this.orderByNewestEvent(this.state.archived, (sortedList) => {this.setState({archived: sortedList})});
        this.orderByNewestEvent(this.state.cancelled, (sortedList) => {this.setState({cancelled: sortedList})});
    };


    orderByTime = (eventList, callback) => {
        let listSorted = eventList;
        if(listSorted !== null){
            listSorted.sort(function(a, b){
                let fileA = a.endDate;
                let fileB = b.endDate;
                fileA = fileA.split('/').reverse().join('');
                fileB = fileB.split('/').reverse().join('');
                return fileA < fileB ? 1 : fileA > fileB ? -1 : 0;
            })
        }
        callback(listSorted);
    };

    // Sends the user to create event screen when clicking the "plus"-button
    addEventClicked = () => {
        history.push("/opprett")
    };

    // Stores all the organizer's events before rendering the page
    componentDidMount() {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, () => {
            EventStore.archiveOldEvents().then(res => {
                if (res.data.changedRows > 0) {
                    Alert.info(res.data.changedRows + " ferdige arrangementer vil bli flyttet til arkivert");
                }
            }).then( () => this.setState({loading:false}));
        });

        EventStore.storeAllEventsForOrganizer(() => {
            this.setState({
                events: EventStore.allEventsForOrganizer,
                published: EventStore.allEventsForOrganizer.filter(event => event.status === 1),
                planning: EventStore.allEventsForOrganizer.filter(event => event.status === 0),
                archived: EventStore.allEventsForOrganizer.filter(event => event.status === 2),
                cancelled: EventStore.allEventsForOrganizer.filter(event => event.status === 3)
            }, () => {
                this.orderByNewestEvent(this.state.planning, (sortedList) => { this.setState({planning: sortedList});
                this.orderByNewestEvent(this.state.published, (sortedList) => {this.setState({published: sortedList})});
                this.orderByNewestEvent(this.state.archived, (sortedList) => {this.setState({archived: sortedList})});
                this.orderByNewestEvent(this.state.cancelled, (sortedList) => {this.setState({cancelled: sortedList})});
                })});
        }, CookieStore.currentUserID);
    }

    render() {
        if (this.state.loading) return (<div>Loading</div>);
        if (CookieStore.currentUserID > -1){
            return (
                <div>
                <Card className={"border-0 justify-content-md-center m-4"}>
                    <h3 className={"mt-4 mb-4"}>Mine arrangement</h3>
                    <Search searchHandler={this.searchHandler} results={this.state.events}/>
                    <Row className="filterMenu mb-2 mt-2">
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
                        </Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}>
                        <label htmlFor={"sorting"}>Sorter etter:</label>
                        <ButtonGroup id={"sorting"}>
                            <Button name="nylige" onClick = {this.changeAllByNewest} variant="primary">Nylige</Button>
                            <Button name = "sluttdato" onClick = {this.changeAllByTime} variant="primary">Slutt Dato</Button>
                        </ButtonGroup>
                    </Col>
                </Row>

                {this.state.active === "all" || this.state.active === "published" ?
                    <Accordion id="publishedEvents" defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Publisert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.published.length > 0 ?
                                <EventView events={this.state.published}/> :
                                <NoEvents message="Du har ingen planlagte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion> : null}
                {this.state.active === "all" || this.state.active === "planning" ?
                    <Accordion id="plannedEvents" defaultActiveKey="0">
                    <Row className="no-gutters">
                        <p>Under planlegging</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                    </Row>
                    <Accordion.Collapse eventKey="0">
                        <Row className="no-gutters">
                            {this.state.planning.length > 0 ?
                                <EventView events={this.state.planning}/> :
                                <NoEvents message="Du har ingen arrangement under planlegging"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion> : null}
                {this.state.active === "all" || this.state.active === "archived" ?
                    <Accordion id="archivedEvents" defaultActiveKey="1">
                    <Row className="no-gutters">
                        <p>Arkivert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                    </Row>
                    <Accordion.Collapse eventKey={this.state.active === "archived" ? "1" : "0"}>
                        <Row className="no-gutters">
                            {this.state.archived.length > 0 ?
                                <EventView events={this.state.archived}/> :
                                <NoEvents message="Du har ingen arkiverte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion> : null}

                {this.state.active === "all" || this.state.active === "cancelled" ?
                    <Accordion id="cancelledEvents" defaultActiveKey="1">
                    <Row className="no-gutters">
                        <p>Kansellert</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                    </Row>
                    <Accordion.Collapse eventKey={this.state.active === "cancelled" ? "1" : "0"}>
                        <Row className="no-gutters">
                            {this.state.cancelled.length > 0 ?
                                <EventView events={this.state.cancelled}/> :
                                <NoEvents message="Du har ingen kansellerte arrangement"/>}
                        </Row>
                    </Accordion.Collapse>
                </Accordion> : null}

                </Card>

                    <div className="padding-top-40"></div>
                            <div onClick={this.addEventClicked} className=" bottom-right">
                                <FaPlusCircle className="ml-2 add-event" size={60}/>
                            </div>

                </div>
            )
        }
        else{
            return null;
        }
    }

    searchHandler(event) {

        //TODO: may need to sett current event in event store perhaps and maybe some other variables?
        EventStore.currentEvent = event;
        RiderStore.storeAllRidersForEvent(() => {
            history.push("/arrangementEdit/" + this.props.event.eventID);
        }, event.eventID);
        history.push(`/arrangementEdit/${event.eventID}`);
    }

    // Sorts the events by either date, price or location
    sortEvents = (events, sortBy, callback) => {
        if(sortBy === 0) {
            let sorted = [].concat(events).sort((a,b) => {
                a = new Date(a.startDate);
                b = new Date(b.startDate);
                return a>b ? 1 : a<b ? -1 : 0;
            });
            callback(sorted);
        } else if(sortBy === 1) {
            let sorted = [].concat(events).sort((a,b) => {
                return (a.eventName > b.eventName ? 1 : a.eventName < b.eventName ? -1 : 0);
            });
            callback(sorted);
        } else if(sortBy === 2) {
            let sorted = [].concat(events).sort((a,b) => {
                return (a.town > b.town ? 1 : a.town < b.town ? -1 : 0);
            });
            callback(sorted);
        }
    };
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