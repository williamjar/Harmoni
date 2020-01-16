import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import {TicketType} from "../../classes/ticketType";
import {CrewStore} from "../../store/crewStore";
import {CookieStore} from "../../store/cookieStore";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {EventStore} from "../../store/eventStore";
import Row from "react-bootstrap/Row";


export class CrewTab extends Component{
    state = {
        editable: [this.props.editable]
    };

    render(){
        return(
            <div>
                {this.state.editable ? <div><AddToCrew/><CrewView/></div> : <CrewView/>}
            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {

        if(props.editable !== state.editable) {
            return {
                editable: props.editable
            }
        }
        return null;
    }
}

export class AddCrewType extends Component{
    constructor(props){
        super(props);

        this.state = {
            crewType : "",
        };

    }

    render(){
        return(
            <div className="card card-body">
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Personell type</Form.Label>
                            <Form.Control type="name" placeholder="" onChange={this.handleInputChange}/>
                        </Form.Group>
                    </Form.Row>

                    <Row className="no-gutter">
                        <Col className="col-1">
                    <Button variant="primary" type="submit" onClick={this.submitForm}>
                        Submit
                    </Button>
                        </Col>
                        <Col className="col-1">
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.props.cancelButton}>
                        Cancel
                    </Button>
                        </Col>
                    </Row>
            </div>
        )
    }

    handleInputChange = (event) => {
        let currentState = this.state;
        currentState.crewType = event.target.value;
        this.setState(currentState);
    }

    submitForm = () => {
        if(this.state.crewType.trim() === ""){
            //Error message
            alert("Du kan ikke ha en blank kategori");
        } else{
            alert(this.state.crewType);
            this.props.submit();
        }
    }
}

export class AddToCrew extends Component{
    constructor(props){
        super(props);

        this.state = {
            numberOfFilesAdded: 0,
            showRegisterCrewType:false,
            showRegisterCrewMember : false,
            results : [],
        };

    }

    componentDidMount() {
        this.updateCrewSearch();
    }

    render() {
        return(
            <div className="card card-body">
                <div className="row">
                    <div className="col-12">
                        Personell type
                    </div>
                </div>



                <div className="row padding-top-20 align-items-center">

                    <div className="col-4">

                        <select className="form-control" id="crewCategory" onChange={this.showRegisterCrewTypeForm}>
                            <option>Lydperson</option>
                            <option>Lysperson</option>
                            <option>Legg til ny..</option>
                        </select>

                    </div>


                    <div className="col-4">
                        <input className="form-check-input" type="checkbox" value="" id="mainResponsible"/>
                        <label className="form-check-label" htmlFor="mainResponsible">
                            Hovedansvarlig
                        </label>
                    </div>
                </div>

                {this.state.showRegisterCrewType?
                    <div className="row padding-top-20">
                        <div className="col-12">
                            <AddCrewType cancelButton={this.cancelCrewTypeAdd} submit={this.addNew}/>
                        </div>
                    </div>
                    :null}

                <div className="row padding-top-20">
                    <div className="col-12">
                        Legg til personell
                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-lg-8 col-md-8">
                        <Search searchHandler={this.searchHandler} results={this.state.results}  />
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <button className="btn btn-success" onClick={this.showRegisterCrewMemberForm}>Registrer ny</button>
                    </div>
                </div>

                {this.state.showRegisterCrewMember?<AddCrewMember toggleRegisterCrewMember={this.showRegisterCrewMemberForm} submit={this.searchHandler} />:null}


                <div className="row padding-top-20">
                    <div className="col-12">
                        <label htmlFor="descriptionCrew">Beskrivelse</label>
                        <textarea className="form-control" id="descriptionCrew" rows="4"></textarea>
                    </div>

                </div>

                <div className="row padding-top-20">


                    <div className="col-6">
                        <span className="btn btn-primary btn-file">
                            Legg til vedlegg <input type="file" multiple="multiple" id="uploadAttachment" onChange={() => this.addFile()}/>
                        </span>
                        {this.state.numberOfFilesAdded > 0 && this.state.numberOfFilesAdded<2? <div className="padding-left-5">{this.state.numberOfFilesAdded + " file added"}</div>: null}
                        {this.state.numberOfFilesAdded > 1 ? <div className="padding-left-5">{this.state.numberOfFilesAdded + " files added"}</div>: null}

                    </div>

                    <div className="col-4 offset-2 text-right">
                        <button className="btn btn-success rounded" onClick={this.addNew}>Lagre personell</button>
                    </div>
                </div>

            </div>
        )
    }

    cancelCrewTypeAdd = () => {
        let currentState = this.state;
        currentState.showRegisterCrewType = false;
        this.setState(currentState);
    };

    updateCrewSearch = () => {
        console.log("update crew search");
        CrewStore.storeAllCrewMembersForOrganizer((list) => {
            let currentState = this.state;
            currentState.results = list;
            this.setState(currentState);
            console.log("Searchable crew");
            console.log(this.state);
        }, CookieStore.currentUserID);
    };


    showRegisterCrewTypeForm = (event) => {
        if(event.target.value.trim() === "Legg til ny.."){
            let currentState = this.state;
            currentState.showRegisterCrewType = !currentState.showRegisterCrewType;
            this.setState(currentState);
        }
    };

    showRegisterCrewMemberForm= (event) => {
        let currentState = this.state;
        currentState.showRegisterCrewMember = !currentState.showRegisterCrewMember;
        this.setState(currentState);
    };

    searchHandler = () => {
        this.updateCrewSearch();
    };

    addFile = () =>{
        /*For adding attachments to crew */

        let attachment = document.querySelector("#uploadAttachment").files.length;
        if(attachment !== undefined){
            let currentState = this.state;
            currentState.numberOfFilesAdded = attachment;
            this.setState(currentState); // Get the number of files selected for upload, to be used for user GUI
        }
    };

    addNew = () => {
        /* Fetches the information from the forms to be used with database */

        //TODO: Search bar is not functiong yet.
        let crewSelect = document.querySelector("#crewCategory").value;
        let mainResponsible = document.querySelector("#mainResponsible").checked;
        let description = document.querySelector("#descriptionCrew").value;
        let attachment = document.querySelector("#uploadAttachment").files;

        let json = {
            crewCategory : crewSelect,
            responsible : mainResponsible,
            description : description,
            attachments : attachment,
        }

    };
}

export class AddedCrew extends Component{

    render() {
        return (
            <div>
                <div className="row padding-top-20">
                    <div className="col-12">
                        <b>Personell som er lagt til</b>
                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-3">
                        <b>Lysperson</b>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card card-body">
                            Navn navnesen
                        </div>
                        <div className="card card-body">
                            Navn navnesen
                        </div>

                    </div>
                </div>

            </div>
        );
    }

}


export class CrewView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crewList: []
        }
    }

    render() {
        if (this.state.crewList === null){
            return null;
        } else {
            console.log(this.state.crewList);
            return(
                <Card.Body>
                    <div className="row padding-top-20">
                        <div className="col-12">
                            Personell som er lagt til:
                        </div>
                    </div>
                    <ListGroup>
                            {this.state.crewList.map(e => (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Navn: {e.contactName}</Col>
                                        <Col>Mobil: {e.phone}</Col>
                                        <Col>E-post: {e.email}</Col>
                                        <Col>Beskrivelse: {e.description}</Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                </Card.Body>
            )
        }
    }

    returnOneCrewMember = () => {
        console.log('runs returnCrew');
        CrewStore.getCrewMember(1, (data) => {
            this.setState(
                { contactName : data.contactName,
                        phone : data.phone,
                        email : data.email,
                        description: data.description})
        });
        console.log(this.state);
    };

    returnCrew = () => {
        CrewStore.storeAllCrewMembersForEvent(() => {
            console.log("return crew members" + CrewStore.allCrewForCurrentEvent);
            this.setState(
                { crewList : CrewStore.allCrewForCurrentEvent })
        }, EventStore.currentEvent.eventID);
        console.log("current eventID:" + EventStore.currentEvent.eventID);
        console.log(this.state);
    };

    componentDidMount() {
        this.returnOneCrewMember();
        this.returnCrew();

    }
}

export class AddCrewMember extends Component{

    constructor(props){
        super(props);

        this.state = {
            name : "",
            phone : "",
            email : "",
            description: "",
            isResponsible: false,
            crewCategoryID : 1
        };
    }

    render() {
        return(
            <div className="card card-body">
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Navn</Form.Label>
                            <Form.Control type="name" placeholder="" onChange={this.handleNameChange} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="phone" placeholder="" onChange={this.handlePhoneChange}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Epost</Form.Label>
                        <Form.Control type="email" placeholder="" onChange={this.handleEmailChange} />
                    </Form.Group>
                    <Form.Group controlId="formGridDescription">
                        <Form.Label>Beskrivelse</Form.Label>
                        <Form.Control type="text" placeholder="" onChange={this.handleDescriptionChange} />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submitForm}>
                        Submit
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegister}>
                        Cancel
                    </Button>

                </Form>
            </div>
        )
    }

    handleNameChange = (event) =>{
        let currentState = this.state;
        currentState.name = event.target.value;
        this.setState(currentState);
    };

    handlePhoneChange = (event) => {
        let currentState = this.state;
        currentState.phone = event.target.value;
        this.setState(currentState);
    };

    handleEmailChange = (event) => {
        let currentState = this.state;
        currentState.email = event.target.value;
        this.setState(currentState);
    };

    handleDescriptionChange = (event) =>{
        let currentState = this.state;
        currentState.description = event.target.value;
        this.setState(currentState);
    };


    submitForm = () => {
        CrewStore.createCrewMemberForEvent(this.state.name, this.state.phone, this.state.email, this.state.description, this.state.crewCategoryID, this.state.isResponsible, EventStore.currentEvent.eventID, CookieStore.currentUserID, () => {});
        this.props.toggleRegisterCrewMember();
        this.props.submit();
    };

    cancelRegister = () => {
        this.props.toggleRegisterCrewMember();
    };


}
