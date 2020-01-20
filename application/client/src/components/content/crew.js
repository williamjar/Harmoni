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
import {OrganizerStore} from "../../store/organizerStore";
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

export class CrewPanel extends Component{

    constructor(props){
        super(props);

        this.state = {
            crewList : [],
            crewCategoryList : [],
            showArtistCard: false,
            performerSelected : {},
            results : [],
            showRegisterNew : false,
        }
    }

    render() {
        return(
            <div>

                <div className="row">
                    <div className="col-lg-6 col-md-12  border-right">
                        <div className="row">
                            <div className="col-8">
                                <Search searchHandler={this.searchHandler} results={this.state.crewList} />
                            </div>
                            <div className="col-4">
                                <button className="btn btn-success" onClick={this.toggleRegisterNew}>Registrer ny</button>
                            </div>
                        </div>

                        <div className="padding-top-20">
                            {this.state.showRegisterNew?<AddCrewMember submit={this.submitFunction} toggleRegisterCrewMember={this.toggleRegisterNew} crewCategoryList={this.state.crewCategoryList} />:null}

                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <CrewView crewList={this.state.crewList} changeCard={this.changeCurrentPerformer} unAssignArtist={this.unAssignArtist}/>
                    </div>
                </div>

            </div>
        )
    }

    componentDidMount() {
        this.returnCrew();
        this.returnCrewCategories();
    }

    toggleRegisterNew = () => {
        this.setState({showRegisterNew : !this.state.showRegisterNew});
    };º

    returnCrew = () => {
        CrewStore.storeAllCrewMembersForEvent(() => {
            this.setState(
                { crewList : CrewStore.allCrewForCurrentEvent })
        }, EventStore.currentEvent.eventID);
    };

    returnCrewCategories = () => {
        CrewStore.storeAllCrewCategoriesForOrganizer(() => {
            console.log("return categories for organizer");
            console.log(CrewStore.allCrewCategoriesForOrganizer);
            this.setState(
                {
                    crewCategoryList : CrewStore.allCrewCategoriesForOrganizer
                })
        }, OrganizerStore.currentOrganizer.organizerID); //OrganizerStore.currentOrganizer
        console.log(" liste over pesonellkategorier:");
        console.log( this.state.crewCategoryList.crewCategoryID);
    };

    submitFunction = () => {
        this.returnCrew();
    };

    changeCurrentCrewMember = () => {

    };
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
                        <Form.Label>Personell-type</Form.Label>
                        <Form.Control type="name" placeholder="" onChange={this.handleInputChange}/>
                    </Form.Group>
                </Form.Row>

                    <Row className="no-gutter">
                        <Col className="col-1">
                    <Button variant="success" type="submit" onClick={this.submitForm}>
                       Lagre
                    </Button>
                        </Col>
                        <Col className="col-1">
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.props.cancelButton}>
                        Avbryt
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
            CrewStore.addCategory(this.state.crewType, OrganizerStore.currentOrganizer.organizerID);
            alert(this.state.crewType);
            console.log("følgende kategori og ID : ");
            console.log(this.state.crewType);
            console.log( OrganizerStore.currentOrganizer.organizerID);
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
            categoryID: 1,
            crewCategoryList : [],
            results : []
        };

    }

    componentDidMount() {
        this.updateCrewSearch();
        this.returnCrewCategories();
    }

    returnCrewCategories = () => {
        CrewStore.storeAllCrewCategoriesForOrganizer(() => {
            console.log("return categories for organizer");
            console.log(CrewStore.allCrewCategoriesForOrganizer);
            this.setState(
                {
                    crewCategoryList : CrewStore.allCrewCategoriesForOrganizer
                })
        }, OrganizerStore.currentOrganizer.organizerID); //OrganizerStore.currentOrganizer
    };

    handleCategoryChange(e){
        this.setState({
            categoryID: e.target.value,
        })
        this.showRegisterCrewTypeForm(e);
        console.log("onChange");
    };

    handleAddNewCategory(e){
        this.setState({
            categoryID: e.target.value,
        })
        this.showRegisterCrewTypeForm(e);
        console.log("onClick");

    }

    render() {
        return(
            <div className="card card-body">
                <div className="row">
                    <div className="col-12">
                        Personell-type
                    </div>
                </div>



                <div className="row padding-top-20 align-items-center">

                    <div className="col-4">
                        <Form>
                        <Form.Group controlId="fromGridCategory">
                            <Form.Label>Velg personell-type</Form.Label>
                            <select
                                value={this.state.categoryID}
                                onChange={e => this.handleCategoryChange(e)}
                                onClick={e => this.handleAddNewCategory(e)}
                            >
                                {this.state.crewCategoryList.map(category => (
                                    <option key={category.crewCategoryID} value={category.crewCategoryID}>
                                        {category.crewCategoryName}
                                    </option>
                                ))}
                                <option>
                                    Legg til ny..
                                </option>
                            </select>
                        </Form.Group>
                        </Form>



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
        this.returnCrewCategories();
        /* Fetches the information from the forms to be used with database */

        //TODO: Search bar is not functiong yet.
      /*  let crewSelect = document.querySelector("#crewCategory").value;
        let mainResponsible = document.querySelector("#mainResponsible").checked;
        let description = document.querySelector("#descriptionCrew").value;
        let attachment = document.querySelector("#uploadAttachment").files;

        let json = {
            crewCategoryName : crewSelect,
            responsible : mainResponsible,
            description : description,
            attachments : attachment,
        } */



    };
}

export class CrewView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crewList: this.props.crewList,
            categoryList: [],
            categoryName: ""
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
                    {this.state.categoryList.map(e => (
                        <ListGroup.Item>
                            <Row>
                                <Col> Kategori: {e.crewCategoryName}</Col>
                            </Row>
                            {this.state.crewList.filter(u=>u.crewCategoryName === e.crewCategoryName).map(u=> (
                                <Row>
                                    <Col>Navn: {u.contactName}</Col>
                                    <Col>Mobil: {u.phone}</Col>
                                    <Col>E-post: {u.email}</Col>
                                    <Col>Beskrivelse: {u.description}</Col>
                                    <Col>Personell-type: {u.crewCategoryName}</Col>
                                    <Col>Hovedsansvarlig? {u.isResponsible}</Col>
                                    <Col></Col>
                                </Row>
                            ))}
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </Card.Body>
            )
        }
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current performer to be displayed in card */
        if(props.crewList!== state.crewList) {
            return {
                crewList: props.crewList
            };
        }
        return null;
    }

/*
    returnOneCrewMember = () => {
        console.log('runs returnCrew');
        CrewStore.getCrewMember(1, (data) => {
            this.setState(
                { crewList : data})
        });
        console.log(this.state);
    }; */

    returnCrewCategories = () => {
        CrewStore.storeAllCrewCategoriesForEvent(() => {
            this.setState(
                {
                    categoryList : CrewStore.allCrewCategoriesForCurrentEvent
                })
        }, EventStore.currentEvent.eventID);
        console.log("return categories for event");
        console.log(CrewStore.allCrewCategoriesForCurrentEvent);
        console.log(this.state.categoryList);
    };

    componentDidMount() {
      //  this.returnOneCrewMember();
        this.returnCrewCategories();

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
            crewCategoryID : 1,
            showRegisterCrewType : false,
            selectedCategoryID: 1,
            crewCategoryList: [this.props.crewCategoryList]
        };
    }


    render() {
        return(
            <div className="card card-body">
                <Form.Group>
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

                    <Form.Group controlId="fromGridCategory">
                        <Form.Label>Velg personell-type</Form.Label>
                        <select
                            value={this.state.selectedCategoryID}
                            onChange={e =>
                                this.setState({
                                    selectedCategoryID: e.target.value,
                                })
                            }
                        >
                            {this.state.crewCategoryList.map(category => (
                                <option key={category.crewCategoryID} value={category.crewCategoryID}>
                                    {category.crewCategoryName}
                                </option>
                            ))}
                        </select>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Hovedansvarlig</Form.Label>
                        <input
                            type="checkbox"
                            onClick={this.handleIsResponsibleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submitForm}>
                        Submit
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegister}>
                        Cancel
                    </Button>
                </Form.Group>
            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current performer to be displayed in card */
        if(props.crewCategoryList!== state.crewCategoryList) {
            return {
                crewCategoryList: props.crewCategoryList
            };
        }
        return null;
    }

    showRegisterCrewTypeForm = () => {
        this.setState({showRegisterCrewType : true})
    };

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
    handleIsResponsibleChange = (event) =>{
        //currentState.isResponsible = event.target.value;
        this.setState({isResponsible: !this.state.isResponsible});
        console.log("status?");
        console.log(this.state.isResponsible);
        console.log((this.state.isResponsible ? 1 : 0));
        //this.setState(currentState);
    };


    submitForm = () => {

        CrewStore.createCrewMemberForEvent(() => {
            this.props.toggleRegisterCrewMember();
            this.props.submit();
        }, this.state.name, this.state.phone, this.state.email, this.state.description, this.state.selectedCategoryID, (this.state.isResponsible ? 1 : 0), EventStore.currentEvent.eventID, CookieStore.currentUserID,
            );
    };

    cancelRegister = () => {
        this.props.toggleRegisterCrewMember();
    };

    componentDidMount() {

    }


}
