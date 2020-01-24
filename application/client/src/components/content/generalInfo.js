import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Form, Image, Row, Spinner} from "react-bootstrap";
import {FaCalendarAlt, FaClock, FaHouseDamage} from "react-icons/fa";
import placeholder from './placeholder.jpg'
import {Ticket} from "../ticket";
import {EventStore} from "../../store/eventStore";
import {PictureService} from "../../store/pictureService";
import {CheckList} from "./checklist";
import {MegaValidator} from "../../megaValidator";
import {Alert} from "../alerts";
import {Map} from "./map";

/**
 * @class EventForm
 * @classdesc Component for viewing or editing the general info about an event.
 * The component changes if the event is in "edit mode" or not
 */
export class GeneralInfo extends Component{

    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        return(
            <div>
                <InfoForm editMode={this.props.editMode}/>
                <Row>
                    <Col>
                        <Card className="mb-2 border-0">
                            <Card.Title>Billetter</Card.Title>
                            <Ticket/>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

/**
 * @class InfoForm
 * Component for editing or submitting general info about an event
 */
export class InfoForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: this.props.editMode,
            eventName: EventStore.currentEvent.eventName,
            startDate: EventStore.currentEvent.startDate,
            endDate: EventStore.currentEvent.endDate,
            startTime: EventStore.currentEvent.startTime,
            endTime: EventStore.currentEvent.endTime,
            address: EventStore.currentEvent.address,
            zipCode: EventStore.currentEvent.zipCode,
            town: EventStore.currentEvent.town,
            description: EventStore.currentEvent.description,
            eventType: EventStore.currentEvent.eventType,
            status: EventStore.currentEvent.status,
            eventTypes: [],
            dateError: false,
            issueList: [],
            selectedFile: null,
            uploadingPicture: false,
            savingInformation: false,
            serverFile: null,
            pictureID: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Updates the state and the event store object when form input is changed
    handleChange(event){
        this.updateIssueList();
        this.setState({savingInformation:false});
        const target = event.target;
        if (target.name === 'selectedFile'){
            this.setState({[target.name]: target.files[0]});
        }
        else{
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;

            this.setState({[name]: value,});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.submitForm();
    }

    componentDidMount() {
        this.updateIssueList();

        if (EventStore.currentEvent.picture !== null && EventStore.currentEvent.picture > 0){
            this.setState({pictureID: EventStore.currentEvent.picture});
            PictureService.getPicture(EventStore.currentEvent.picture, picture => {
                if (picture !== null){
                    PictureService.previewPicture(picture.pictureLink, link => {
                        this.setState({serverFile: link});
                    });
                }
            })
        }
        if (!(EventStore.eventCategories[0])) {
            EventStore.getEventCategories(() => {
                this.setState({eventTypes: EventStore.eventCategories});
            });
        }
    }

    render() {
        if(this.state.edit){
            return(
                    <Row className="margin-bottom-20">
                    <Col xs={12} md={6}>
                    <Card className="mb-2 border-0">
                        <Form onSubmit={this.handleSubmit}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                     <Form.Text>Tittel på arrangementet</Form.Text>
                                    <Form.Control size="lg" type="text" value={this.state.eventName} name="eventName" placeholder="Tittel" onChange={this.handleChange}/>
                                    </Col>
                                </Row>
                                <br/>
                                <Form.Group>
                                    <Row className="mb-2">
                                        <Col xs="5">
                                            <FaCalendarAlt className="mr-1"/>
                                            <Form.Label>Start</Form.Label>
                                            <Form.Control type="date" placeholder={this.formatDateFromSql(this.state.startDate)} value={this.formatDateFromSql(this.state.startDate)} name="startDate" onChange={this.handleChange}/>
                                        </Col>
                                        <Col xs="3">
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                            <Form.Control type="time" value={this.state.startTime} name="startTime" onChange={this.handleChange}/>
                                        </Col>
                                        <Col>
                                            <Form.Label>Type arrangement</Form.Label>
                                            <Form.Control as="select" value={this.state.eventType} name="eventType" onChange={this.handleChange}>
                                                {EventStore.eventCategories.map((cat,i) => (
                                                    <option key={cat} value={i+1}>{cat}</option>
                                                ))
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="5">
                                            <FaCalendarAlt className="mr-1"/>
                                            <Form.Label>Slutt</Form.Label>
                                            <Form.Control type="date" placeholder={this.formatDateFromSql(this.state.endDate)} value={this.formatDateFromSql(this.state.endDate)} name="endDate" onChange={this.handleChange}/>
                                        </Col>
                                        <Col xs="3">
                                            <FaClock className="mr-1"/>
                                            <Form.Label>Tid</Form.Label>
                                            <Form.Control type="time" value={this.state.endTime} name="endTime" onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="5">
                                            <FaHouseDamage className="mr-1"/>
                                            <Form.Label>Adresse</Form.Label>
                                            <Form.Control type="text" value={this.state.address} name="address" onChange={this.handleChange}/>
                                        </Col>
                                        <Col xs="3">
                                            <Form.Label>Postnummer</Form.Label>
                                            <Form.Control style={{width : '4.5rem'}} type="tel" maxLength="4" value={this.state.zipCode} name="zipCode" onChange={this.handleChange}/>
                                        </Col>
                                        <Col xs="3">
                                            <Form.Label>By</Form.Label>
                                            <Form.Control type="text" value={this.state.town} name="town" onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Label>Beskrivelse</Form.Label>
                                            <Form.Control as="textarea" rows="3" value={this.state.description} name="description" onChange={this.handleChange}/>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Row>
                                    <Col>
                                <Form.Group>
                                    <Button hidden={this.state.savingInformation} onmouseover={() => this.updateIssueList} type="submit" variant="success">Lagre informasjon</Button>
                                    <Button hidden={!this.state.savingInformation} disabled variant={"success"}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> Lagrer informasjon</Button>
                                </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Form>
                    </Card>
                    </Col>
                        <Col align={"center"}>
                            <CheckList issueList={this.state.issueList}/>
                            <div className="padding-top-30">
                            <Image src={this.state.serverFile != null ? this.state.serverFile : placeholder} alt="event image" fluid className="" width={"500px"}/>
                            </div>
                            <h5 className={"mt-2"}>Last opp et bilde til arrangementet</h5>

                            <span className="btn btn-secondary btn-file margin-right-20">Legg til bilde
                                <input type={"file"} name={"selectedFile"} onChange={event => {this.setState({selectedFile: event.target.files[0]})}}/></span>

                            <Button type={"file"} variant={"success"} onClick={() => {
                                this.setState({uploadingPicture: true});
                                if(MegaValidator.validateFile(this.state.selectedFile)){
                                    let fileForm = new FormData();
                                    fileForm.append("description", this.state.selectedFile.name);
                                    fileForm.append("selectedFile", this.state.selectedFile);
                                    PictureService.insertEventPicture(EventStore.currentEvent.eventID, fileForm, (statusCode, path, newPictureID) => {
                                        if (statusCode === 200 && path) {
                                            PictureService.previewPicture(path, link => {
                                                EventStore.currentEvent.picture = newPictureID;
                                                this.setState({pictureID: newPictureID});
                                                this.setState({serverFile: link});
                                                Alert.success("Bildet ditt ble lastet opp")
                                            });
                                        }
                                        else{
                                            Alert.danger("Beklager, det har oppstått en feil med opplastningen")
                                        }
                                    });
                                }
                                else{
                                    Alert.danger("Beklager, det har oppstått en feil med opplastningen")
                                }
                            }}>Last opp bilde</Button>
                        </Col>
                    </Row>

            )}
        else{
            return (
                <div>
                    <Row>
                        <Col xs={12} md={6}>
                        <Card className="mb-2 border-0">
                            <Card className="m4 text-white" bg="danger" hidden={!(this.state.status===3)}><Card.Body>Dette arrangementet er kansellert, du kan gjennoppta arrangementet i menyen nedenfor</Card.Body></Card>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title className={"h2 font-weight-bold"}>{EventStore.currentEvent.eventName}</Card.Title>
                                    </Col>
                                </Row>
                                <Form.Group>
                                    <Row className="mb-2">
                                        <Col xs="5">
                                            <Row>
                                                <Col>
                                                    <FaCalendarAlt className="mr-1"/>
                                                    <Form.Label>Start</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.startDate !== null ?
                                                this.formatDate(EventStore.currentEvent.startDate) :
                                                null}
                                        </Col>
                                        <Col xs="3">
                                            <Row>
                                                <Col>
                                                    <FaClock className="mr-1"/>
                                                    <Form.Label>Tid</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.startTime}

                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    <Form.Label>Kategori:</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.eventCategories[EventStore.currentEvent.eventType-1]}
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="5">
                                            <Row>
                                                <Col>
                                                    <FaCalendarAlt className="mr-1"/>
                                                    <Form.Label>Slutt</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.endDate !== null ?
                                                this.formatDate(EventStore.currentEvent.endDate) :
                                                null}
                                        </Col>
                                        <Col xs="3">
                                            <Row>
                                                <Col>
                                                    <FaClock className="mr-1"/>
                                                    <Form.Label>Tid</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.endTime}
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Col xs="5">
                                            <Row>
                                                <Col>
                                                    <FaHouseDamage className="mr-1"/>
                                                    <Form.Label>Adresse</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.address}
                                        </Col>
                                        <Col xs="3">
                                            <Row>
                                                <Col>
                                                    <Form.Label>Postnummer</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.zipCode}
                                        </Col>
                                        <Col xs="3">
                                            <Row>
                                                <Col>
                                                    <Form.Label>Poststed</Form.Label>
                                                </Col>
                                            </Row>
                                            {EventStore.currentEvent.town}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Row className="mt-2">
                                                <Col>
                                                    <Card.Title>Beskrivelse</Card.Title>
                                                    {EventStore.currentEvent.description}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="info" disabled={this.state.status===2 || this.state.status === 3} onClick={() => this.editMode()}>Rediger informasjon</Button>
                                </Form.Group>
                            </Card.Body>

                        </Card>
                        </Col>


                        <Col>
                            <Card className={"border-0"}>
                                <Card.Body align={"center"}>
                                    <Image src={this.state.serverFile != null ? this.state.serverFile : placeholder} alt="event image" fluid className=""/>
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    {this.state.address !== null && this.state.address.trim() !== "" ? <Row className = "padding-bottom-20">
                        <Col>
                            <Map
                                location = {this.state.address + ", " + this.state.town}
                            />
                        </Col>
                    </Row> : null}

                </div>

            );
        }
    }

    updateIssueList(){
        let list = [];

        if(this.state.eventName===null) {
            list.push("Mangler tittel");
        } else if (this.state.eventName.length <= 1) {
            list.push("Mangler tittel");
        }

        if(this.state.description===null){
            list.push("Mangler beskrivelse");
        } else if(this.state.description.length <= 1){
            list.push("Mangler beskrivelse");
        }

        if(this.state.address===null || this.state.zipCode===null || this.state.town===null) {
            list.push("Addresse er ikke satt");
        } else if(this.state.address.length<=1 || this.state.zipCode.length<=1 || this.state.town.length<=1) {
            list.push("Addresse er ikke satt");
        }

        if(this.state.startDate===null || this.state.endDate===null){
            list.push("Dato er ikke satt");
        } else if(this.state.startDate.length<=1 || this.state.endDate.length<=1){
            list.push("Dato er ikke satt");
        }

        if(this.state.startTime===null || this.state.endTime===null){
            list.push("Tidspunkt er ikke satt");
        } else if (this.state.startTime.length<=1 || this.state.endTime.length<=1){
            list.push("Tidspunkt er ikke satt");
        }

        this.setState({issueList: list})
    }


    validateForm(){
        if(this.state.startDate===this.state.endDate){
            return this.state.startTime < this.state.endTime;
        }

        return this.state.startDate < this.state.endDate;
    }

    editMode(){
        this.setState({edit:true});
    }


    submitForm(){

        this.setState({savingInformation: true});
        this.setState({dateError: false});
        if(this.validateForm()){
            this.save();
            EventStore.editCurrentEvent().then(this.setState({savingInformation: false}));
            this.setState({edit:false});
        } else{
            this.setState({dateError: true});
            Alert.danger("Arrangementet kan ikke slutte før det har startet. Sjekk dato og tid.");
        }
    }

    save(){
        EventStore.currentEvent.eventName = this.state.eventName;
        EventStore.currentEvent.startDate = this.formatDate(this.state.startDate);
        EventStore.currentEvent.endDate = this.formatDate(this.state.endDate);
        EventStore.currentEvent.startTime = this.state.startTime;
        EventStore.currentEvent.endTime = this.state.endTime;
        EventStore.currentEvent.eventType = this.state.eventType;
        EventStore.currentEvent.address = this.state.address;
        EventStore.currentEvent.zipCode = this.state.zipCode;
        EventStore.currentEvent.town = this.state.town;
        EventStore.currentEvent.description = this.state.description;
        EventStore.currentEvent.picture = this.state.pictureID;
    }
    // Converts a javascript date to a format compatible with both datepicker and mysql
    formatDate(date) {
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


    formatDateFromSql(date){
        //2019-12-31T23:00:00.000Z
        let newDate = date.split('T');
        return newDate[0];
    }
}




