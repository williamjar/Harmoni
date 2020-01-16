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
    ListGroup,
    Row,
    Tab,
    Table
} from "react-bootstrap";
import {FaAngleDown, FaPlusCircle} from "react-icons/fa";
import {EventView} from "./eventView";
import {Event} from "../../../classes/event";
import {Search} from "../search";
import {EventStore} from "../../../store/eventStore";
import {CookieStore} from "../../../store/cookieStore";
import {createHashHistory} from "history";

const history = createHashHistory();


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

    addEventClicked = () => {
        history.push("/opprett")
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
                            {this.state.events.filter(e => e.status === 1).length > 0 ?
                                <EventView events={this.state.events.filter(event => event.status === 1)}/> :
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
                                <EventView events={this.state.events.filter(event => event.status === 0)}/> :
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
                                <EventView events={this.state.events.filter(event => event.status === 2)}/> :
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
}

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