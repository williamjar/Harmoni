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
    FaPhone, FaPlusCircle,
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
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"]
        };
    }

    componentDidMount() {
        ArtistService.getArtistForOrganizer((res) => this.setState({performers: res}), CookieStore.currentUserID);
    }

    render() {
        console.log(this.state.performers);
        return(
            <div>
                <Card className="border-0 m-4 artists">
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
                    {this.state.performers.length !== null ? this.state.genres.map((genre, i) => {
                        if(this.state.performers.find(performer => {return performer.genre === i + 1})) {
                            return(
                                <Accordion id={genre} defaultActiveKey="0">
                                    <Row className="no-gutters primary-color-dark">
                                        <p>{genre}</p>
                                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                                    </Row>
                                    <Accordion.Collapse eventKey="0">
                                        <Row className="no-gutters">
                                            <ContactList performers={this.state.performers.filter(performer => performer.genre === i + 1)}/>
                                        </Row>
                                    </Accordion.Collapse>
                                </Accordion>)
                        } else {
                            return null;
                        }
                    }) : <div className="mt-5 center">
                            Du har ingen registrerte artister
                    </div>}
                </Card>
                <Row>
                    <Col>
                        <div className="btn btn-info btn-lg float-right" onClick>
                            <FaPlusCircle className="mr-2"/>
                            Legg til artist
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            performers: this.props.performers,
            showContact: false,
            currentPerformer: null,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"]
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.performers !== state.performers) {
            return {
                performers: props.performers
            }
        }
        return null;
    }

    viewPerformer = (e) => {
        console.log("view clicked");
        this.setState({
            showContact: true,
            currentPerformer: this.state.performers.find(performer => {return performer.artistID === parseInt(e.target.id)})
        });
    };

    hidePerformer = () => {
        this.setState({showContact: false});
    };

    render() {
        return(
            <Table responsive>
                <tbody>
                {this.state.performers.map(performer => (
                    <tr align='center' className="contact pointer" onClick={this.viewPerformer} id={performer.artistID} key={performer.artistID}>
                        <td align="left" id={performer.artistID}>{performer.contactName}</td>
                        <td id={performer.artistID}></td>
                        <td align="right" id={performer.artistID}><FaEye size={30}>Vis</FaEye></td>
                    </tr>
                ))}
                </tbody>
                <Modal show={this.state.showContact} onHide={this.hidePerformer}>
                    <Modal.Header closeButton>
                        <FaUserCircle size={35} className="mr-1"/>
                        <Modal.Title>{this.state.currentPerformer !== null ? this.state.currentPerformer.contactName : null}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Kontakt</h5>
                        <Row>
                            <Col xs={1}>
                                <FaEnvelopeSquare/>
                            </Col>
                            <Col>
                                {this.state.currentPerformer !== null ? <a href={"mailto:" + this.state.currentPerformer.email}>{this.state.currentPerformer.email}</a> : null}
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col xs={1}>
                                <FaPhone/>
                            </Col>
                            <Col>
                                {this.state.currentPerformer !== null ? this.state.currentPerformer.phone : null}
                            </Col>
                        </Row>
                        <h5>Artistinfo</h5>
                        <Row>
                            <Col xs={1}>
                                <FaMusic/>
                            </Col>
                            <Col>
                                {this.state.currentPerformer !== null && this.state.currentPerformer.genre !== null ? this.state.genres[this.state.currentPerformer.genre] : null}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={1}>
                                <FaCalendar/>
                            </Col>
                            <Col>
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