import React from 'react';
import {Search} from "../search";
import {Button, ButtonGroup, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {
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
import {Alert} from "../../alerts";
import {MegaValidator} from "../../../megaValidator";

/**
 * @class PerformerContacts
 * @classdesc Component for displaying all artists related to an organizer in a contact list
 */
export class PerformerContacts extends React.Component {

    /**
     *
     * @param props,
     */
    constructor(props) {
        super(props);

        this.state = {
            active: "all",
            performers: [],
            currentPerformer: null,
            showContact: false,
            addNew: false,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"],
        };

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        ArtistService.getArtistForOrganizer((res) => this.setState({performers: res}, () => {
            this.sortPerformers(this.state.performers);
        }), CookieStore.currentUserID);
    }

    /**
     *
     * @param performers - An array of performer-objects
     * @description Sorts an array of performers alphabetically by name
     */
    sortPerformers = (performers) => {
        let sorted = [].concat(performers).sort((a,b) => {
            return a.contactName>b.contactName ? 1 : a.contactName<b.contactName ? -1 : 0;
        });
        this.setState({performers: sorted});
    };

    /**
     *
     * @param e - Event triggering the function
     * @description Updates the state and tells the component what genre to filter by
     */
    filterPerformers = (e) => {
        this.setState({active: e.target.name});
    };

    /**
     *
     * @param selected - The selected element from the artist search
     * @description Handles when the user selects an element in search and updates current performer in state
     */
    searchHandler = (selected) => {
        this.setState({currentPerformer: selected, show: true});
    };

    /**
     * @description Handles when the user closes the contact info pop up
     */
    hidePerformer = () => {
        this.update( () => this.setState({show: false, addNew: false}));
    };

    /**
     *
     * @param callback - Function called when the query to the database has completed
     * @description Updates the array of performers with a new fetch from the database
     */
    update = (callback) => {
        ArtistService.getArtistForOrganizer((res) => {
            this.setState({performers: res}, () => callback());
        }, CookieStore.currentUserID);
    };

    /**
     * @description Handles when the user clicks "add new" and shows a dialog
     */
    addClicked = () => {
        this.setState({addNew: true});
    };

    render() {
        return(
            <div>
                <Card className="border-0 m-4 artists">
                    <Row>
                        <Col>
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
                    {this.state.performers.length !== null ? this.state.genres.map((genre, i) => {
                        if(this.state.performers.find(performer => {return performer.genre === i + 1}) && (this.state.active === genre || this.state.active === "all")) {
                            return(
                                <Accordion key={genre} id={genre} defaultActiveKey="0">
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
                        <div className="btn btn-info btn-lg float-right" onClick={this.addClicked}>
                            <FaPlusCircle className="mr-2"/>
                            Legg til artist
                        </div>
                    </Col>
                </Row>
                {this.state.currentPerformer !== null ? <ContactInfo show={this.state.show} contact={this.state.currentPerformer} onHide={this.hidePerformer}/> : null}
                <AddPerformer show={this.state.addNew} onHide={this.hidePerformer}/>
            </div>
        )
    }
}

export class ContactList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            unsorted: this.props.performers,
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
        this.setState({
            currentPerformer: this.state.performers.find(performer => {return performer.artistID === parseInt(e.target.id)})
        },() => this.setState({showContact: true}));
    };

    hidePerformer = () => {
        this.props.updateHandler(() => this.setState({showContact: false}))
    };


    render() {
        return(
            <Table responsive hover>
                <tbody>
                {this.state.performers.map(performer => (
                    <tr align='center' className="contact pointer" onClick={this.viewPerformer} id={performer.artistID} key={performer.artistID}>
                        <td align="left" id={performer.artistID}>{performer.contactName}</td>
                        <td id={performer.artistID}></td>
                    </tr>
                ))}
                </tbody>
                {this.state.currentPerformer !== null ? <ContactInfo show={this.state.showContact} contact={this.state.currentPerformer} onHide={this.hidePerformer} updateHandler={this.props.updateHandler}/> : null}
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
                genre: this.state.contact.genre
            }, () => this.setState({show: props.show}, ));
        }
    }

    componentDidMount() {
        this.setState({
            contact: this.props.contact,
        }, () => this.setState({show: this.props.show}));
    }

    editClicked = () => {
        this.setState({editable: true, show: false}, () => this.setState({show: true}));
    };

    saveClicked = () => {
        ContactService.updateContactInfo(this.state.contact.contactID, this.state.contactName, this.state.phone, this.state.email, () => {
            ArtistService.updateArtistGenre(() => {
                Alert.success("Kontaktinformasjon har blitt oppdatert");
                this.setState({
                    show: false,
                    editable: false,
                }, () => this.setState({show: true}));
            }, this.state.contact.artistID, parseInt(this.state.genre), CookieStore.currentUserID, this.state.contact.contactID)
        })
    };

    deletePerformer = (e) => {
        ArtistService.deleteArtist(this.state.contact.contactID).then(r => {
            Alert.success("Artist er slettet");
            this.props.onHide();
        });

    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value, show: false}, () => {
            this.setState({show: true});
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
                            {this.state.editable ? <Form.Control name="email" type="email" value={this.state.email}
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
                <Modal.Footer className={"text-danger"}>
                    {this.validateForm()}
                    {this.state.editable ? <Button variant="success" onClick={this.saveClicked}>Lagre</Button> : <Button variant="secondary" onClick={this.editClicked}>Rediger</Button>}
                    <Button variant="danger" onClick={this.deletePerformer}>Slett</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

class AddPerformer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            contactName: "",
            email: "",
            phone: "",
            genre: 1,
            genres: ["Pop","Rock", "Metal", "Blues", "Hip Hop", "Electronic Dance Music", "Jazz", "Country", "Klassisk", "ANNET"],
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
        ArtistService.createArtist(() => {
            this.props.onHide();
            //Alert.success("Ny artist er registert");
        }, this.state.contactName, this.state.phone, this.state.email, this.state.genre, CookieStore.currentUserID)
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
                            <Form.Control name="phone" type="text" value={this.state.phone} onChange={this.handleChange}
                            placeholder="Telefon"/>
                        </Col>
                    </Row>
                    <h5>Musikksjanger</h5>
                    <Row>
                        <Col xs={1}>
                            <FaMusic/>
                        </Col>
                        <Col>
                            <Form.Control name="genre" as="select" defaultValue={1} onChange={this.handleChange}>{
                                this.state.genres.map((genre,i) => {return <option key={i} value={i + 1}>{genre}</option>})
                            }</Form.Control>
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