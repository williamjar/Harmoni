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
import Table from "react-bootstrap/Table";
import {ArtistService} from "../../../store/artistService";
import {CookieStore} from "../../../store/cookieStore";
import Accordion from "react-bootstrap/Accordion";
import {ContactService} from "../../../store/contactService";

export class PerformerContacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            performers: [],
            currentPerformer: null,
            showContact: false,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"],
        };

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        ArtistService.getArtistForOrganizer((res) => this.setState({performers: res}), CookieStore.currentUserID);
    }

    filterPerformers = (e) => {
        this.setState({active: e.target.name});
    };

    searchHandler = (selected) => {
        this.setState({currentPerformer: selected, show: true}, () => console.log(selected));
    };

    hidePerformer = () => {
        this.update( () => this.setState({show: false}));
    };

    update = (callback) => {
        ArtistService.getArtistForOrganizer((res) => {
            this.setState({performers: res}, () => callback());
        }, CookieStore.currentUserID);
    };

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
                    <Search searchHandler={this.searchHandler} results={this.state.performers}/>
                    <Row className="filterMenu mb-2 mt-2">
                        <Col>
                            <ButtonGroup size="sm">
                                <Button name="all" variant="secondary" active={this.state.active === "all"}
                                        onClick={this.filterPerformers}>Alle</Button>
                                <Button name="Pop" variant="secondary" active={this.state.active === "Pop"}
                                        onClick={this.filterPerformers}>Pop</Button>
                                <Button name="Rock" variant="secondary" active={this.state.active === "Rock"}
                                        onClick={this.filterPerformers}>Rock</Button>
                                <Button name="Metal" variant="secondary" active={this.state.active === "Metal"}
                                        onClick={this.filterPerformers}>Metal</Button>
                                <Button name="Blues" variant="secondary" active={this.state.active === "Blues"}
                                        onClick={this.filterPerformers}>Blues</Button>
                                <Button name="Hip Hop" variant="secondary" active={this.state.active === "Hip Hop"}
                                        onClick={this.filterPerformers}>Hip Hop</Button>
                                <Button name="Electronic Dance Music" variant="secondary" active={this.state.active === "Electronic Dance Music"}
                                        onClick={this.filterPerformers}>EDM</Button>
                                <Button name="Jazz" variant="secondary" active={this.state.active === "Jazz"}
                                        onClick={this.filterPerformers}>Jazz</Button>
                                <Button name="Country" variant="secondary" active={this.state.active === "Country"}
                                        onClick={this.filterPerformers}>Country</Button>
                                <Button name="Klassisk" variant="secondary" active={this.state.active === "Klassisk"}
                                        onClick={this.filterPerformers}>Klassisk</Button>
                                <Button name="Annet" variant="secondary" active={this.state.active === "Annet"}
                                        onClick={this.filterPerformers}>Annet</Button>
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
                        if(this.state.performers.find(performer => {return performer.genre === i + 1}) && (this.state.active === genre || this.state.active === "all")) {
                            return(
                                <Accordion id={genre} defaultActiveKey="0">
                                    <Row className="no-gutters primary-color-dark">
                                        <p>{genre}</p>
                                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                                    </Row>
                                    <Accordion.Collapse eventKey="0">
                                        <Row className="no-gutters">
                                            <ContactList performers={this.state.performers.filter(performer => performer.genre === i + 1)} updateHandler={this.update}/>
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
                {console.log(this.state.currentPerformer)}
                {this.state.currentPerformer !== null ? <ContactInfo show={this.state.show} contact={this.state.currentPerformer} onHide={this.hidePerformer}/> : null}
            </div>
        )
    }
}

export class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unsorted: this.props.performers,
            performers: [],
            showContact: false,
            currentPerformer: null,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"]
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.unsorted !== state.unsorted) {
            return {
                unsorted: props.unsorted
            }
        }
        return null;
    }

    viewPerformer = (e) => {
        console.log("view clicked");
        this.setState({
            currentPerformer: this.state.performers.find(performer => {return performer.artistID === parseInt(e.target.id)})
        },() => this.setState({showContact: true}));
    };

    hidePerformer = () => {
        this.props.updateHandler(() => this.setState({showContact: false}))
    };

    sortPerformers = (performers) => {
        let sorted = [].concat(performers).sort((a,b) => {
            return a.contactName>b.contactName ? 1 : a.contactName<b.contactName ? -1 : 0;
        });
        this.setState({performers: sorted});
    };

    componentDidMount() {
        this.sortPerformers(this.props.performers);
    }

    render() {
        return(
            <Table responsive>
                <tbody>
                {this.state.performers.map(performer => (
                    <tr align='center' className="contact pointer" onClick={this.viewPerformer} id={performer.artistID} key={performer.artistID}>
                        <td align="left" id={performer.artistID}>{performer.contactName}</td>
                        <td id={performer.artistID}></td>
                        <td align="right" id={performer.artistID}><FaEye size={30} id={performer.artistID}>Vis</FaEye></td>
                    </tr>
                ))}
                </tbody>
                {this.state.currentPerformer !== null ? <ContactInfo show={this.state.showContact} contact={this.state.currentPerformer} onHide={this.hidePerformer}/> : null}
            </Table>
        )
    }
}

export class ContactInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            contact: this.props.contact,
            contactName: this.props.contact.contactName,
            email: this.props.contact.email,
            phone: this.props.contact.phone,
            genre: this.props.contact.genre,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"],
            editable: false,
        }
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.contact !== this.state.contact || nextProps.show !== this.state.show);
    }

    componentDidUpdate(props) {
        this.setState({
            show: this.props.show,
            contact: this.props.contact,
            contactName: this.state.contact.contactName,
            email: this.state.contact.email,
            phone: this.state.contact.phone,
            /*genre: this.state.contact.genre*/
        });
    }

    editClicked = () => {
        this.setState({editable: true, show: false}, () => this.setState({show: true}));
    };

    saveClicked = () => {
        console.log(this.state.genre);
        ContactService.updateContactInfo(this.state.contact.contactID, this.state.contactName, this.state.phone, this.state.email, () => {
            ArtistService.updateArtistGenre(() => {
                console.log(this.state.genre);
                this.setState({show: false, editable: false}, () => this.setState({show: true}));
            }, this.state.contact.artistID, parseInt(this.state.genre), CookieStore.currentUserID, this.state.contact.contactID)
        })
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value, show: false}, () => {
            this.setState({show: true});
        });
    };

    render() {
        return(
            <Modal show={this.state.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <FaUserCircle size={35} className="mr-1"/>
                    <Modal.Title>{this.state.editable ? <Form.Control name="contactName" type="text" value={this.state.contactName}
                    onChange={this.handleChange}/> : this.state.contactName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Kontakt</h5>
                    <Row>
                        <Col xs={1}>
                            <FaEnvelopeSquare/>
                        </Col>
                        <Col>
                            {this.state.editable ? <Form.Control name="email" type="text" value={this.state.email}
                            onChange={this.handleChange}/> : <a href={"mailto:" + this.state.email}>{this.state.email}</a>}
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col xs={1}>
                            <FaPhone/>
                        </Col>
                        <Col>
                            {this.state.editable ? <Form.Control name="phone" type="text" value={this.state.phone}
                            onChange={this.handleChange}/> : this.state.phone}
                        </Col>
                    </Row>
                    <h5>Artistinfo</h5>
                    <Row>
                        <Col xs={1}>
                            <FaMusic/>
                        </Col>
                        <Col>
                            {this.state.editable ? <Form.Control name="genre" as="select" defaultValue={this.state.genre}
                            onChange={this.handleChange}>{
                                this.state.genres.map((genre,i) => {return <option value={i + 1}>{genre}</option>})
                            }</Form.Control> : this.state.genres[this.state.genre - 1]}
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
                    {this.state.editable ? <Button variant="success" onClick={this.saveClicked}>Lagre</Button> : <Button variant="secondary" onClick={this.editClicked}>Rediger</Button>}
                    <Button variant="danger">Slett</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}