import React from 'react';
import {Search} from "../search";
import {Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {
    FaEnvelopeSquare,
    FaPhone, FaPlusCircle,
    FaUserCircle
} from "react-icons/all";
import Table from "react-bootstrap/Table";
import {CookieStore} from "../../../store/cookieStore";
import {ContactService} from "../../../store/contactService";
import {CrewStore} from "../../../store/crewStore";
import {Alert} from "../../alerts";
import {MegaValidator} from "../../../megaValidator";

/**
 * @class CrewContacts
 * classdesc Component for displaying all crew related to an organizer in a contact list
 */
export class CrewContacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            crew: [],
            currentCrew: null,
            showContact: false,
            addNew: false,
            crewCategory: [],
        };

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        CrewStore.storeAllCrewMembersForOrganizer(() => {
            this.setState({crew: CrewStore.allCrewMembersForOrganizer}, ()=> this.sortCrew(this.state.crew))
        }, CookieStore.currentUserID);
    }

    sortCrew = (crew) => {
        let sorted = [].concat(crew).sort((a,b) => {
            return a.contactName>b.contactName ? 1 : a.contactName<b.contactName ? -1 : 0;
        });
        this.setState({crew: sorted});
    };

    searchHandler = (selected) => {
        this.setState({currentCrew: selected, show: true});
    };

    hideCrew = () => {
        this.update(() => {
            this.setState({show: false, addNew: false});
        });
    };

    update = (callback) => {
        CrewStore.storeAllCrewMembersForOrganizer(() => {
            this.setState({crew: CrewStore.allCrewMembersForOrganizer}, ()=> {
                this.sortCrew(this.state.crew);
                callback();
            })
        }, CookieStore.currentUserID);
    };

    addClicked = () => {
        this.setState({addNew: true});
    };

    render() {
        return(
            <div>
                <Card className="border-0 m-4 artists">
                    <Row>
                        <Col>
                            <h3 className={"mt-4 mb-4"}>Mitt personell</h3>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    <Search searchHandler={this.searchHandler} results={this.state.crew}/>
                    {this.state.crew.length !== null ?
                        <Row className="no-gutters mt-2">
                            <CrewContactList crew={this.state.crew} updateHandler={this.update}/>
                        </Row> : <div className="mt-5 center">
                        Du har ingen registrerte personell
                    </div>}
                </Card>
                <Row>
                    <Col>
                        <div className="btn btn-info btn-lg float-right" onClick={this.addClicked}>
                            <FaPlusCircle className="mr-2"/>
                            Legg til personell
                        </div>
                    </Col>
                </Row>
                {this.state.currentCrew !== null ? <CrewContactInfo show={this.state.show} contact={this.state.currentCrew} onHide={this.hideCrew}/> : null}
                <AddCrew show={this.state.addNew} onHide={this.hideCrew}/>
            </div>
        )
    }
}

export class CrewContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unsorted: this.props.crew,
            crew: this.props.crew,
            showContact: false,
            currentCrew: null,
        }
    }

    static getDerivedStateFromProps(props, state) {
        if(props.crew !== state.crew) {
            return {
                crew: props.crew
            }
        }
        return null;
    }

    viewCrew = (e) => {
        this.setState({
            currentCrew: this.state.crew.find(crew => {return crew.crewID === parseInt(e.target.id)})
        },() => this.setState({showContact: true}));
    };

    hidePerformer = () => {
        this.props.updateHandler(() => this.setState({showContact: false}))
    };

    render() {
        return(
            <Table responsive hover>
                <thead>
                <tr align='center'>
                    <th align="left">Navn</th>
                    <th>Telefon</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {this.state.crew.map(crew => (
                    <tr align='center' className="contact pointer" onClick={this.viewCrew} id={crew.crewID} key={crew.crewID}>
                        <td align="left" id={crew.crewID}>{crew.contactName}</td>
                        <td id={crew.crewID}>{crew.phone}</td>
                        <td align="right" id={crew.crewID}></td>
                    </tr>
                ))}
                </tbody>
                {this.state.currentCrew !== null ? <CrewContactInfo show={this.state.showContact} contact={this.state.currentCrew} crewCategories={this.state.crewCategory} onHide={this.hidePerformer} updateHandler={this.props.updateHandler}/> : null}
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
            description: this.props.contact.description,
            editable: false,
        }
    }

    shouldComponentUpdate(nextProps) {
        return ((nextProps.show !== this.state.show) || (nextProps.contact !== this.state.contact && this.state.editable !== true))
    }

    componentDidUpdate(props) {

        if(this.state.editable) {
            this.setState({show: props.show});
        } else {
            this.setState({
                contact: props.contact,
                contactName: this.state.contact.contactName,
                email: this.state.contact.email,
                phone: this.state.contact.phone,
                description: this.state.contact.description
            }, () => this.setState({show: props.show}, ));
        }
    }

    componentDidMount() {
        this.setState({
            contact: this.props.contact
        }, () => this.setState({show: this.props.show}))
    }

    editClicked = () => {
        this.setState({editable: true, show: false}, () => this.setState({show: true}));
    };

    saveClicked = () => {
        ContactService.updateContactInfo(this.state.contact.contactID, this.state.contactName, this.state.phone, this.state.email, () => {
            CrewStore.updateCrewMember(this.state.description, this.state.contact.crewID).then(r => {
                Alert.success("Kontaktinformasjon har blitt oppdatert");
                this.setState({show: false, editable: false}, () => this.setState({show: true}));
            });
        })
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value, show: false}, () => {
            this.setState({show: true});
        });
    };

    deleteCrew = (e) => {
        CrewStore.deleteCrewMember(this.state.contact.contactID);
        Alert.success("Personell har blitt slettet");
        this.props.onHide();
    };

    validateForm(){

        if(!MegaValidator.validateUsernameLength(this.state.contactName)){
            return 'Vennligst skriv inn et navn';
        }
        if(!MegaValidator.validateUsername("none", this.state.contactName)){
            return 'Navnet kan bare inneholde bokstaver';
        }
        if(!MegaValidator.validateEmailLength("none", this.state.email)){
            return 'Vennligst skriv in en epost-adresse';
        }
        if(!MegaValidator.validatePhoneNumberLength(this.state.phone)){
            return 'Telefonnummer er ikke gyldig';
        }
        else{
            return '';
        }
    }

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
                    <h5>Beskrivelse</h5>
                    {this.state.editable ? <Form.Control name="description" as="textarea" value={this.state.description} onChange={this.handleChange}/> :
                        <Card.Body>
                            {this.state.description}
                        </Card.Body>
                    }
                </Modal.Body>
                <Modal.Footer className={"text-danger"}> {this.validateForm()}
                    {this.state.editable ? <Button variant="success" onClick={this.saveClicked}>Lagre</Button> : <Button variant="secondary" onClick={this.editClicked}>Rediger</Button>}
                    <Button onClick={this.deleteCrew} variant="danger">Slett</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

class AddCrew extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            contactName: "",
            email: "",
            phone: "",
            description: "",
        }
    }

    shouldComponentUpdate(nextProps) {
        return (nextProps.show !== this.state.show);
    }

    componentDidUpdate(props) {
        this.setState({show: props.show});
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value, show: false}, () => {
            this.setState({show: true});
        });
    };

    saveClicked = () => {
        CrewStore.createCrewMember(this.state.contactName, this.state.phone, this.state.email, this.state.description, CookieStore.currentUserID, () => {
            this.setState({contactName: "", email: "", phone: "", description: ""});
            Alert.success("Personell har blitt opprettet");
            this.props.onHide();
        });
    };

    validateForm(){

        if(!MegaValidator.validateUsernameLength(this.state.contactName)){
            return 'Vennligst skriv inn et navn';
        }
        if(!MegaValidator.validateUsername("none", this.state.contactName)){
            return 'Navnet kan bare inneholde bokstaver';
        }
        if(!MegaValidator.validateEmailLength("none", this.state.email)){
            return 'Vennligst skriv in en epost-adresse';
        }
        if(!MegaValidator.validatePhoneNumberLength(this.state.phone)){
            return 'Telefonnummer er ikke gyldig';
        }
        else{
            return '';
        }
    }

    render() {
        return(
            <Modal show={this.state.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <FaUserCircle size={35} className="mr-1"/>
                    <Modal.Title>
                        <Form.Control name="contactName" type="text" value={this.state.contactName} onChange={this.handleChange}
                                      placeholder="Navn"/>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Kontaktinformasjon</h5>
                    <Row>
                        <Col xs={1}>
                            <FaEnvelopeSquare/>
                        </Col>
                        <Col>
                            <Form.Control name="email" type="email" value={this.state.email} onChange={this.handleChange}
                                          placeholder="Epostadresse"/>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col xs={1}>
                            <FaPhone/>
                        </Col>
                        <Col>
                            <Form.Control name="phone" type="email" value={this.state.phone} onChange={this.handleChange}
                                          placeholder="Telefon"/>
                        </Col>
                    </Row>
                    <h5>Beskrivelse</h5>
                    <Row>
                        <Col>
                            <Form.Control name="description" as="textarea" value={this.state.description} onChange={this.handleChange}/>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className={"text-danger"}> {this.validateForm()}
                    <Button variant="success" disabled={!(this.validateForm()==='')} onClick={this.saveClicked}>Legg til</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}