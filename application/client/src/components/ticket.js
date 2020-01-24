import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {Row, Spinner} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import {TicketStore} from "../store/ticketStore";
import {EventStore} from "../store/eventStore";


/*
    Static labels to guide the users witch type om information
    they are supposed to fill inn.
*/
let nameTicekt = 'Billettnavn';
let priceTicket = 'Billettpris';
let amountTicket = 'Antall tilgj. billetter';
let releaseDate = 'Start salgsdato';
let releaseTime ='Start salgstid';
let endDate = 'Slutt salgsdato';
let endTime = 'Slutt salgstid';
let description = 'Beskrivelse';

/**
 * @class Ticket
 * @classdesc Component to share all the ticket components
 */
export class Ticket extends Component{
    render(){
        return(
            <Card className={"border-0"}>
                    <TicketAll/>
            </Card>
        );
    }
}

/**
 * @class TicketAll
 * @classdesc The component both fetch tickets from database, post new tickets
 and delete tickets from the database.
 */
export class TicketAll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketTypeName: '',
            price : '',
            amount : '',
            releaseDate : null,
            endDate : null,
            releaseTime : null,
            endTime : null,
            description : '',
            ticketList : [],
            savingInformation: false,
            loading: false,
            dateError: false,
            noEndSellingDate: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        if(this.state.loading){
            return(<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>);
        }

        return(
            <Card className={"border-0 mb-3 p-4"}>
                    {this.state.ticketList.map(ticket => (
                        <Card key={ticket} className={"shadow mb-3"}>
                            <Card.Body>
                            <Form>
                                <Row className="ticketStyle" >
                                    <Col>
                                        <Form.Text>{nameTicekt}</Form.Text>
                                        <Form.Control
                                            value={ticket.ticketTypeName}
                                            readOnly
                                            plaintext
                                        />

                                    </Col>
                                    <Col>
                                        <Form.Text>{priceTicket}</Form.Text>
                                        <Form.Control
                                            value={ticket.price}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{amountTicket}</Form.Text>
                                        <Form.Control
                                            value={ticket.amount}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{releaseDate}</Form.Text>
                                        <Form.Control
                                            value={this.formatDate(ticket.releaseDate)}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>

                                    <Col>
                                        <Form.Text>{releaseTime}</Form.Text>
                                        <Form.Control
                                            value={ticket.releaseTime}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>
                                </Row>

                                <Row className="ticketStyle">
                                    <Col>
                                        <Form.Text>{description}</Form.Text>
                                        <Form.Control
                                            value={ticket.description}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>

                                    <Col/>
                                    <Col/>
                                    <Col>
                                        <Form.Text>{endDate}</Form.Text>
                                        <Form.Control
                                            value={this.checkIfNull(this.formatDate(ticket.endDate))}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>

                                    <Col>
                                        <Form.Text>{endTime}</Form.Text>
                                        <Form.Control
                                            value={ticket.endTime}
                                            readOnly
                                            plaintext
                                        />
                                    </Col>

                                </Row>
                                <Row className="ticketStyle">
                                    <Col>
                                        <Button variant="danger" id={ticket.ticketTypeID} onClick={this.deleteTicket}>Fjern billett</Button>
                                    </Col>

                                </Row>
                            </Form>
                            </Card.Body>
                        </Card>
                    ))}


                <Accordion>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        + Opprett ny billettype til arrangmentet
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card className={"border-0"}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="ticketStyle">
                                    <Col>
                                        <Form.Text>{nameTicekt}</Form.Text>
                                        <Form.Control
                                            name = "ticketTypeName"
                                            placeholder = "Billettnavn"
                                            value = {this.state.ticketTypeName}
                                            onChange = {this.handleInputChange}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{priceTicket}</Form.Text>
                                        <Form.Control
                                            name = "price"
                                            placeholder="Pris"
                                            max="1000000"
                                            type="number"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.price}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{amountTicket}</Form.Text>
                                        <Form.Control
                                            name = "amount"
                                            placeholder="Antall tilgj."
                                            type="number"
                                            max="1000000"
                                            onChange = {this.handleInputChange}
                                            value = {this.state.amount}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Text>{releaseDate}</Form.Text>
                                        <Form.Control
                                            type = "date"
                                            name = "releaseDate"
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>
                                    <Col >
                                        <Form.Text>{releaseTime}</Form.Text>
                                        <Form.Control
                                            type = "time"
                                            name = "releaseTime"
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>

                                </Row>
                                <Row className="ticketStyle">
                                    <Col>
                                        <Form.Text>{description}</Form.Text>
                                        <Form.Control
                                            name = "description"
                                            placeholder="Beskrivelse"
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>
                                    <Col/>
                                    <Col/>
                                    <Col>
                                        <Form.Text>{endDate}</Form.Text>
                                        <Form.Control
                                            type ="date"
                                            name = "endDate"
                                            onChange={this.handleInputChange}
                                            disabled={!this.state.noEndSellingDate}
                                        />
                                    </Col>

                                    <Col>
                                        <Form.Text>{endTime}</Form.Text>
                                        <Form.Control
                                            type = "time"
                                            name = "endTime"
                                            onChange={this.handleInputChange}
                                            disabled={!this.state.noEndSellingDate}
                                        />
                                    </Col>

                                </Row>
                                <Row className="ticketStyle">
                                <Col>

                                <Button variant="success" type="submit"  disabled={!this.validateForm()} onClick={this.handleSubmit}>
                                    Legg til billett
                                </Button>
                                    <Form.Text hidden={!this.state.dateError} className={"text-danger"}>Sluttdato for salg av billett kan ikke være før startdato</Form.Text>
                                </Col>
                                    <Col/>
                                    <Col/>

                                    <Col >
                                        <Form.Check
                                            type="checkbox"
                                            name="noEndSellingDate"
                                            label="Sett sluttdato og tid for salg av billett"
                                            value={this.state.noEndSellingDate}
                                            checked={this.state.noEndSellingDate}
                                            onChange={this.handleInputChange}
                                        />
                                    </Col>
                                    <Col/>
                                </Row>
                            </Form>
                        </Card>
                    </Accordion.Collapse>
                </Accordion>
            </Card>
        );
    }
    /*
        Fetches all tickets from the databse the moment the page opens.
    */
    componentDidMount() {
        this.listTickets();
    }

    validateForm(){
        return this.validateDate() && this.state.ticketTypeName !== '' && this.state.price !== '' && this.state.amount !== '' && this.state.releaseDate !== null && this.state.releaseTime !== null;
    }


    checkIfNull(obamium){

        if(obamium === null){
            return obamium + " er ikke satt";
        }

        if(obamium === 'torsdag 1. januar 1970'){
            return "Sluttdato er ikke satt";
        }

        return obamium;
    }

    validateDate(){
        if(!this.state.noEndSellingDate) return true;

        if(this.state.endDate ===null) return false;

        if(this.state.releaseDate===this.state.endDate){
            return this.state.releaseTime < this.state.endTime;
        }

        return this.state.releaseDate < this.state.endDate;
    }

    formatDate = (d) => {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let date = new Date(d);
        return date.toLocaleDateString("nb-NO", options).toLocaleLowerCase();
    };

    /*
        Updates all the states when changed.
    */
    handleInputChange(event) {
        let target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
        this.setState({[name]: value,});

    }

    /*
        Post the new ticket in the database and notifies the user
        with an alert message.
    */
    handleSubmit(event){
        event.preventDefault();
        TicketStore.addTicket(EventStore.currentEvent.eventID,
            this.state.ticketTypeName, this.state.price, this.state.amount,
            this.formatDateToSql(this.state.releaseDate), this.state.releaseTime, this.formatDateToSql(this.state.endDate),
            this.state.endTime, this.state.description, statusCode => {
                if (statusCode === 200){
                    TicketStore.getAllTicketsForEvent(EventStore.currentEvent.eventID, () => {
                        this.setState({ticketList: TicketStore.allTicketsCurrentEvent});


                    });
                }else{
                    alert("Det oppsto et problem. Vennligs prøv igjen.");
                }
            });

       this.setState( {
            ticketTypeName: '',
            price : '',
            amount : '',
            description : '',
        });

    };

    /*
        List all tickets from the database to one spesific event.
    */
    listTickets = () => {
        this.setState({loading:true});
        TicketStore.getAllTicketsForEvent( EventStore.currentEvent.eventID, () => {
            this.setState(
                { ticketList : TicketStore.allTicketsCurrentEvent});
            this.setState({loading: false});
        });
    };

    /*
        Deletes ticket in the database and nd notifies the user
        with an alert message.
    */
    deleteTicket = (event) => {
        TicketStore.deleteTicket(EventStore.currentEvent.eventID, event.target.id, statusCode => {
            if (statusCode === 200){

                this.setState({savingInformation: false});
                this.listTickets();
            }
            else{
                alert("Det oppsto et problem. Prøv igjen, eller ta kontakt med oss!");
            }
        }).then();

    };


    formatDateToSql(date) {
        let d = new Date(date);
        let month = "" + (d.getMonth() +1);
        let day = "" + (d.getDate());
        let year = d.getFullYear();

        if(month.length < 2) {
            month = "0" + month;
        }
        if(day.length < 2) {
            day = "0" + day;
        }

        return [year, month, day].join("-");
    }


}

