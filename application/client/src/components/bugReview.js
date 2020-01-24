import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Button from "react-bootstrap/Button";
import {BugStore} from "../store/bugStore";
import {MailService} from "../store/mailService";
import {OrganizerStore} from "../store/organizerStore";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Alert} from "../components/alerts";
import {CookieStore} from "../store/cookieStore";

let reportBugs = "Hjelp oss med å finne feil i systemet";
let listBugs = "Feil du alt har rapportert inn";

/**
 * @class BugReview
 * @classdesc Component for submitting and displaying bugs.
 */
export class BugReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            bugList: []
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    render() {
        return (
            <Card.Body>
                <FormGroup controlId="ControlTextarea" className="bugWindow">
                    <FormLabel>
                        {reportBugs}
                    </FormLabel>
                    <Row>
                        <Col>
                        <FormControl
                            as="textarea" rows="5"
                            name="description"
                            placeholder="Skriv din tilbakemelding her"
                            value={this.state.description}
                            onChange={this.handleInputChange}
                        />
                        </Col>
                    </Row>
                    <Row>
                        <Col size={12} className="text-right">
                        <Button className="bugButton btn-lg" variant="success" onClick={this.handleSubmit}>Publiser</Button>
                        </Col>
                    </Row>
                </FormGroup>

                <FormGroup className="bugWindow">
                    <FormLabel className="bugLabel w-100 padding-top-10 padding-bottom-10">{listBugs}</FormLabel>
                    <ListGroup>
                        {this.state.bugList.map(bug => (
                            <ListGroup.Item key={bug.bugID}>
                                <Row>
                                    <Col sm={8}>
                                        {bug.description}
                                    </Col>
                                    <Col sm={2} >
                                        {this.formatDate(bug.date)}
                                    </Col>
                                    <Col sm={2} align={"right"}>
                                        <button id={bug.bugID} onClick={this.deleteBug} className="btn btn-danger">Slett</button>
                                    </Col>
                                </Row>

                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </FormGroup>

            </Card.Body>
        )
    }

    componentDidMount() {
        this.listBugs();
    }

    /*
       Changes the this.state.description when text is put inn.
     */

    handleInputChange(event) {
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        this.setState({[name]: value,});

    }

    /*
        Saves the input to the database when pushed.
        Also updates the list with registrated bugs.
     */
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.description === '') {
            Alert.info("Tilbakemeldingen kan ikke være tom")
        } else {
            BugStore.registerBug(OrganizerStore.currentOrganizer.organizerID, this.state.description, statusCode => {
                if (statusCode === 200) {
                    MailService.sendGeneralEmailToOne("bedriftharmoni@gmail.com", "Bug Report",
                        "Følgende bug har blitt registrert.\n\nBruker: " + OrganizerStore.currentOrganizer.username +
                        "\nUserID: " + OrganizerStore.currentOrganizer.organizerID + "\nBeskrivelse: \"" + this.state.description + "\"",
                        null,
                        (mailStatus) => {
                            if (mailStatus === 200){
                                Alert.info("Din tilbakemelding ble registrert")
                                this.setState({description : ""});
                            }
                            else{
                                Alert.info("Din tilbakemelding ble registrert, men det skjedde en glipp med vårt mailsystem, og vi vil ikke bli informert om bug'en. Vennligst prøv igjen om du ønsker det, eller send en epost til bedriftharmoni@gmail.com");
                            }
                        });
                    BugStore.getAllBugsFromOrganizer(OrganizerStore.currentOrganizer.organizerID, () => {
                        this.setState({bugList: BugStore.allBugsReportedByOrganizer})
                    });
                } else {
                    Alert.warning("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!")
                }
            });
        }
    };

    /*
        List all all bugs from the database to from one organizer.
    */
    listBugs = () => {
        OrganizerStore.getOrganizer(CookieStore.currentUserID, (statusCode) => {
            if (statusCode === 200){
                BugStore.getAllBugsFromOrganizer(OrganizerStore.currentOrganizer.organizerID, () => {
                    this.setState(
                        {bugList: BugStore.allBugsReportedByOrganizer})
                });
            }
        });
    };

    /*
        Deletes a selected bug from the database. 
     */
    deleteBug = (event) => {
        BugStore.deleteBug(event.target.id, statusCode => {
            if (statusCode === 200) {
                Alert.success("Din tilbakemelding ble slettet!");
                this.listBugs();
            } else {
                Alert.warning("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!");
            }
        }).then(r => console.log('Deleting done'));

    };

    // Converts the date of an event to a more readable format
    formatDate = (d) => {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let date = new Date(d);
        return date.toLocaleDateString("nb-NO", options).toLocaleUpperCase();
    }

}