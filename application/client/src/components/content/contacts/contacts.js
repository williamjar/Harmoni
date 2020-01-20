import React, {Component} from 'react';
import {Search} from "../search";
import {Button, ButtonGroup, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {
    FaAddressCard,
    FaAngleDown,
    FaCalendar,
    FaEnvelopeSquare,
    FaEye,
    FaMusic,
    FaPhone,
    FaUserCircle
} from "react-icons/all";
import {EventCard} from "../dashboard/eventCard";
import Table from "react-bootstrap/Table";
import {ArtistService} from "../../../store/artistService";
import {CookieStore} from "../../../store/cookieStore";
import Accordion from "react-bootstrap/Accordion";
import {EventView} from "../dashboard/eventView";
import {NoEvents} from "../dashboard/dashboard";

export class Contacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            performers: [],
            genres: ["ROCK", "POP", "BLUES", "HIP HOP", "EDM", "JAZZ", "COUNTRY", "KLASSISK", "ANNET"]
        };
    }

    componentDidMount() {
        ArtistService.getArtistForOrganizer((res) => this.setState({performers: res}), CookieStore.currentUserID);
    }

    render() {
        console.log(this.state.performers);
        return(
            <Card className={"border-0 justify-content-md-center m-4"}>
                <Row>
                    <Col xs={2}>
                        <h3 className={"mt-4 mb-4"}>Mine artister</h3>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Search searchHandler results/>
                <Row className="filterMenu mb-2 mt-2">
                    <Col>
                        <ButtonGroup size="sm">
                            <Button name="all" variant="secondary" active={this.state.active === "all"}
                                    onClick={this.filterEvents}>Alle</Button>
                            <Button name="planning" variant="secondary" active={this.state.active === "planning"}
                                    onClick={this.filterEvents}>Rock</Button>
                            <Button name="published" variant="secondary" active={this.state.active === "published"}
                                    onClick={this.filterEvents}>Pop</Button>
                            <Button name="archived" variant="secondary" active={this.state.active === "archived"}
                                    onClick={this.filterEvents}>Blues</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Rap/Hip hop</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>EDM</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Jazz</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Country</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Klassisk</Button>
                            <Button name="cancelled" variant="secondary" active={this.state.active === "cancelled"}
                                    onClick={this.filterEvents}>Annet</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Row className="mb-2">
                    <Col xs={2}>
                        <Form.Control as="select" size="sm" onChange={this.sortSelected}>
                            <option selected disabled>Sorter etter..</option>
                            <option value={0}>Navn</option>
                        </Form.Control>
                    </Col>
                </Row>
                {this.state.genres.map(genre => { return(
                    <Accordion id={genre} defaultActiveKey="0">
                        <Row className="no-gutters primary-color-dark">
                            <p>{genre}</p>
                            <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                        </Row>
                        <Accordion.Collapse eventKey="0">
                            <Row className="no-gutters">
                                <ContactList performers={this.state.performers}/>
                            </Row>
                        </Accordion.Collapse>
                    </Accordion>)
                })}
            </Card>
        )
    }
}

export class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performers: this.props.performers
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.performers !== state.performers) {
            return {
                performers: props.performers,
                showContact: false,
            }
        }
        return null;
    }

    viewPerformer = () => {
        console.log("view clicked");
        this.setState({showContact: true});
    };

    hidePerformer = () => {
        this.setState({showContact: false});
    };

    render() {
        return(
            <Table responsive>
                <tbody>
                {this.state.performers.map(performer => (
                    <tr align='center' className="contact" onClick={this.viewPerformer}>
                        <td align="left">{performer.contactName}</td>
                        <td></td>
                        <td align="right"><FaEye size={30}>Vis</FaEye></td>
                    </tr>
                ))}
                </tbody>
                <Modal show={this.state.showContact} onHide={this.hidePerformer}>
                    <Modal.Header closeButton>
                        <FaUserCircle size={35} className="mr-1"/>
                        <Modal.Title>Artistnavn</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Kontakt</h4>
                        <Row>
                            <Col xs={2}>
                                <FaEnvelopeSquare/>
                            </Col>
                            <Col>
                                sevald_marcus@hotmail.com
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col xs={2}>
                                <FaPhone/>
                            </Col>
                            <Col>
                                99251316
                            </Col>
                        </Row>
                        <h4>Artistinfo</h4>
                        <Row>
                            <Col xs={1}>
                                <FaMusic/>
                            </Col>
                            <Col>
                                Rock
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <FaCalendar/>
                            </Col>
                            <Col>
                                Test1, Test2, Test3
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary">Rediger</Button>
                        <Button variant="danger">Slett</Button>
                    </Modal.Footer>
                </Modal>
            </Table>
        )
    }
}