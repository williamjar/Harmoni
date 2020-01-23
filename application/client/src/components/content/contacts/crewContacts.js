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
import {CrewStore} from "../../../store/crewStore";

export class CrewContacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            crew: [],
            currentCrew: null,
            showContact: false,
            crewCategory: [],
        };

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        CrewStore.storeAllCrewMembersForOrganizer(() => {
            this.setState({crew: CrewStore.allCrewMembersForOrganizer}, ()=> console.log(this.state.crew))
        }, CookieStore.currentUserID);
        CrewStore.storeAllCrewCategoriesForOrganizer(() => {
            this.setState({crewCategories: CrewStore.allCrewCategoriesForOrganizer}, () => console.log(this.state.crewCategory))
        }, CookieStore.currentUserID);
    }

    filterCrew = (e) => {
        this.setState({active: e.target.name});
    };

    searchHandler = (selected) => {
        this.setState({currentCrew: selected, show: true}, () => console.log(selected));
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
        return(
            <div>
                <Card className="border-0 m-4 artists">
                    <Row>
                        <Col xs={2}>
                            <h3 className={"mt-4 mb-4"}>Mitt personell</h3>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    <Search searchHandler={this.searchHandler} results={this.state.crew}/>
                    <Row className="mb-2 mt-2">
                        <Col xs={2}>
                            <Form.Control as="select" size="sm" onChange={this.sortSelected}>
                                <option value={0} selected>Alle</option>
                                {this.state.crewCategory.map((category, i) =>  {
                                    return <option value={i + 1}>{category}</option>
                                })}
                            </Form.Control>
                        </Col>
                    </Row>
                    {this.state.crew.length !== null ? this.state.crewCategory.map((crewCategory, i) => {
                        if(this.state.crew.find(crew => {return crew.crewCategoryName === i + 1}) && (this.state.active === crewCategory || this.state.active === "all")) {
                            return(
                                <Accordion id={crewCategory} defaultActiveKey="0">
                                    <Row className="no-gutters primary-color-dark">
                                        <p>{crewCategory}</p>
                                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0" size={20}/>
                                    </Row>
                                    <Accordion.Collapse eventKey="0">
                                        <Row className="no-gutters">
                                            <CrewContactList crew={this.state.crew.filter(crew => crew.crewCategoryName === i + 1)} crewCategories={this.state.crewCategory} updateHandler={this.update}/>
                                        </Row>
                                    </Accordion.Collapse>
                                </Accordion>)
                        } else {
                            return null;
                        }
                    }) : <div className="mt-5 center">
                        Du har ingen registrerte personell
                    </div>}
                </Card>
                <Row>
                    <Col>
                        <div className="btn btn-info btn-lg float-right" onClick>
                            <FaPlusCircle className="mr-2"/>
                            Legg til personell
                        </div>
                    </Col>
                </Row>
                {console.log(this.state.currentCrew)}
                {this.state.currentCrew !== null ? <CrewContactInfo show={this.state.show} contact={this.state.currentCrew} onHide={this.hidePerformer}/> : null}
            </div>
        )
    }
}

export class CrewContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unsorted: this.props.crew,
            crew: [],
            showContact: false,
            currentCrew: null,
            crewCategory: this.props.crewCategories
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

    sortCrew = (crew) => {
        let sorted = [].concat(crew).sort((a,b) => {
            return a.contactName>b.contactName ? 1 : a.contactName<b.contactName ? -1 : 0;
        });
        this.setState({crew: sorted});
    };

    componentDidMount() {
        this.sortCrew(this.props.crew);
    }

    render() {
        return(
            <Table responsive>
                <tbody>
                {this.state.crew.map(crew => (
                    <tr align='center' className="contact pointer" onClick={this.viewPerformer} id={crew.crewID} key={crew.crewID}>
                        <td align="left" id={crew.crewID}>{crew.contactName}</td>
                        <td id={crew.crewID}></td>
                        <td align="right" id={crew.crewID}><FaEye size={30} id={crew.crewID}>Vis</FaEye></td>
                    </tr>
                ))}
                </tbody>
                {this.state.currentCrew !== null ? <CrewContactInfo show={this.state.showContact} contact={this.state.currentCrew} crewCategories={this.state.crewCategory} onHide={this.hidePerformer}/> : null}
            </Table>
        )
    }
}

export class CrewContactInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            contact: this.props.contact,
            contactName: this.props.contact.contactName,
            email: this.props.contact.email,
            phone: this.props.contact.phone,
            crewCategory: this.props.contact.crewCategoryName,
            crewCategories: this.props.crewCategories,
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
        /*ContactService.updateContactInfo(this.state.contact.contactID, this.state.contactName, this.state.phone, this.state.email, () => {
            ArtistService.updateArtistGenre(() => {
                console.log(this.state.genre);
                this.setState({show: false, editable: false}, () => this.setState({show: true}));
            }, this.state.contact.artistID, parseInt(this.state.genre), CookieStore.currentUserID, this.state.contact.contactID)
        })*/
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
                    <h5>Stillingsinfo</h5>
                    <Row>
                        <Col xs={1}>
                            <FaMusic/>
                        </Col>
                        <Col>
                            {this.state.editable ? <Form.Control name="genre" as="select" defaultValue={this.state.genre}
                                                                 onChange={this.handleChange}>{
                                this.state.crewCategories.map((category,i) => {return <option value={i + 1}>{category}</option>})
                            }</Form.Control> : this.state.crewCategory}
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