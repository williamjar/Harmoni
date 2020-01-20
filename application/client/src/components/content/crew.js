import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import {CrewStore} from "../../store/crewStore";
import {CookieStore} from "../../store/cookieStore";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import {EventStore} from "../../store/eventStore";
import {OrganizerStore} from "../../store/organizerStore";
import Row from "react-bootstrap/Row";
import {DocumentService} from "../../store/documentService";
import {Alert} from "../alerts";
import {Document} from "../../classes/document";
import {MailService} from "../../store/mailService";


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
            showCrewCard: false,
            crewSelected : {},
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
                            {this.state.showCrewCard?<CrewCard crewSelected={this.state.crewSelected}/>:null}

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
            this.setState(
                {
                    crewCategoryList : CrewStore.allCrewCategoriesForOrganizer
                })
        }, OrganizerStore.currentOrganizer.organizerID); //OrganizerStore.currentOrganizer
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
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelButton}>
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
    };

    cancelButton = () => {
        this.setState({crewType : ""});
        this.props.cancelButton();
    };

    submitForm = () => {
        if(this.state.crewType.trim() === ""){
            //Error message
            alert("Du kan ikke ha en blank kategori");
        } else{
            CrewStore.addCategory(this.state.crewType, OrganizerStore.currentOrganizer.organizerID);
            alert(this.state.crewType);
            this.props.submit();
        }
    };
}

export class AddToCrew extends Component{
    constructor(props){
        super(props);

        this.state = {
            numberOfFilesAdded: 0,
            showRegisterCrewType : false,
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

export class CrewCard extends Component{
    /* Crew card that shows information about crew members */

    constructor(props){
        super(props);

        this.state = {
            crew : this.props.crewSelected,
            numberOfFilesChosenForUpload: 0,
            numberOfFilesAlreadyUploaded: 0,
            descriptionInput: "",
            signedContract : false,
            payed : false,
        };
    }

    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">
                    <div className="col-2">
                        <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50} alt=""/>
                    </div>

                    <div className="col-7">
                        {this.state.crew.contactName}<br/>
                        {this.state.crew.email}
                    </div>

                    <div className="col-3">
                        <label htmlFor="categorySelect">Kategori</label>
                        <select className="form-control" id="genreSelect">
                            <option>Blues</option>
                            <option>Country</option>
                        </select>
                    </div>


                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-12">
                        Beskrivelse<br/>

                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder=""
                                aria-label=""
                                aria-describedby="basic-addon2"
                                value={this.state.descriptionInput}
                                onChange={this.handleInputCrew}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => this.updateCrew()}>Oppdater beskrivelse</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="signedContract" type="checkbox" checked={this.state.signedContract} id="signedContract"/>
                            <label className="form-check-label" htmlFor="signedContract">
                                Signert kontrakt
                            </label>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="payed" type="checkbox" checked={this.state.payed} id="crewPayed" onChange={this.handleOtherCheckboxes}/>
                            <label className="form-check-label" htmlFor="crewPayed">
                                Betalt
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row padding-top-20">



                    <div className="col-4">
                        <span className="btn btn-primary btn-file">
                            Legg til vedlegg <input type="file" id="uploadAttachmentPerformer" accept="application/pdf" onChange={() => this.addFile()}/>
                        </span>
                        {this.state.numberOfFilesAdded > 0 && this.state.numberOfFilesAdded<2? <div className="padding-left-5">{this.state.numberOfFilesAdded + " file added"}</div>: null}
                        {this.state.numberOfFilesAdded > 1 ? <div className="padding-left-5">{this.state.numberOfFilesAdded + " files added"}</div>: null}

                    </div>

                    <div className="col-4">
                        Filer lagt til fra før: {this.state.numberOfFilesAlreadyUploaded}
                    </div>

                    <div className="col-4 offset-4 text-right">
                        <button className = "butn-success-rounded" onClick={() => this.sendEmail()}>Send offisiell invitasjon til personell</button>
                    </div>

                    <div className="col-4 offset-4 text-right">
                        <button className="btn-success rounded" onClick={() => this.save()} id="saveCrew">Lagre</button>
                    </div>
                </div>

            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current performer to be displayed in card */
        if(props.performerSelected !== state.performer) {
            return {
                performer: props.performerSelected
            };
        }
        return null;
    }

    componentDidMount() {
        let currentState = this.state;
        currentState.numberOfFilesAlreadyUploaded = currentState.performer.documents.length;
        this.setState(currentState);
    }

    //TODO: Change states that show if files are added to server
    addFile = () =>{
        /* For adding attachments to crew */
        let fileInput = document.querySelector("#uploadAttachmentPerformer");

        let attachment = fileInput.files.length;
        if(attachment !== undefined){
            let files = fileInput.files;

            let currentState = this.state;
            currentState.numberOfFilesAdded = files.length;

            this.setState(currentState); // Get the number of files selected for upload, to be used for user GUI

            //TODO: VALIDATE PDF FILES
            //TODO: Choose file category
            let formData = new FormData();
            for (let i = 0; i < files.length; i++){
                formData.set('selectedFile', files[i]);
                DocumentService.addDocument(EventStore.currentEvent.eventID, "Kontrakt", currentState.performer.artistID, null, 1, formData, (statusCode, returnData) => {
                    if (statusCode === 200){
                        console.log("Document was successfully uploaded");
                        Alert.success("Dokumentet ble lastet opp");
                        this.state.performer.addDocument(new Document(returnData.documentID, returnData.documentLink, 1));
                        fileInput.value = '';
                        currentState.numberOfFilesAlreadyUploaded += 1;
                        currentState.numberOfFilesAdded = 0;
                    }
                    else{
                        console.log("Error uploading document");
                        Alert.danger("En feil skjedde under opplastning");
                    }

                });
            }
            this.setState(currentState);
        }
    };

    handleOtherCheckboxes = (event) => {
        this.setState({[event.target.name] : event.target.checked});
    }

    handleInput = (event) =>{
        /* Handles the description input for crew members */
        let currentState = this.state;
        currentState.descriptionInput = event.target.value;
        this.setState(currentState);
    };

    sendEmail(){
        console.log("Sending email to");
        console.log(this.state.crew);
      /*  MailService.sendArtistInvitation(this.state.performer, "Official invitation to " + EventStore.currentEvent.eventName,
            "Welcome!\nHere is your official invitation to " + EventStore.currentEvent.eventName + ".\n" +
            "You have been invited by " + OrganizerStore.currentOrganizer.username + "\n" +
            "And the event will be going from " + EventStore.currentEvent.startDate + " to " + EventStore.currentEvent.endDate + ".\n" +
            "Regards, " + OrganizerStore.currentOrganizer.username, (statusCode) => {
                if (statusCode === 200){
                    console.log("Email sent successfully");
                }
                else{
                    console.log("An error occured sending the email");
                }
            }); */
    }

    save = () => {
        /* Save function to gather all information in the Performer Card that needs to be stored */


        Alert.success("Artist lagret");

        this.state.riders.filter((rider) => rider.artistID === this.state.performer.artistID).map(rider => {
            if (rider.isModified){
                RiderStore.updateRider(() => {rider.isModified = false}, rider.riderID, rider.artistID, EventStore.currentEvent.eventID, rider.status, rider.isDone ? 1 : 0, rider.description);
            }
        });

        //TODO: Send signed contract and if artist has been payed
    }
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
      <div>

            {this.state.categoryList.map(e => (
                <ul className="list-group">

                        <b>{e.crewCategoryName}</b>


                    {this.state.crewList.filter(u=>u.crewCategoryName === e.crewCategoryName).map(u=> (
                        <li className="list-group-item pointer selection" onClick={() => {}}>
                            <div className="row">
                                <div className="col-10">
                                    {u.contactName}
                                </div>

                                <div className="col-2 text-right">
                                    <button className="btn-danger rounded" onClick={() => {}}>Slett</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ))}
      </div>

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
            selectedCategoryID: this.props.crewCategoryList[0].crewCategoryID,
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
                        <Row className="no-gutters">
                            <Col size={6}>
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

                            </Col>


                        <Col size={6}>
                            <button className="btn btn-success" onClick={this.toggleRegisterCrewTypeForm}>Ny kategori</button>
                        </Col>

                        </Row>
                    </Form.Group>

                    {this.state.showRegisterCrewType?
                    <div className="padding-bottom-20">
                        <AddCrewType submit={this.submitCrewType} cancelButton={this.toggleRegisterCrewTypeForm}/>
                    </div>
                    :null}

                    <Form.Group>
                        <Form.Label>Hovedansvarlig</Form.Label>
                        <input
                            type="checkbox"
                            onClick={this.handleIsResponsibleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="button" onClick={this.submitForm}>
                        Lagre
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegister}>
                        Avbryt
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

    toggleRegisterCrewTypeForm = () => {
        this.setState({showRegisterCrewType : !this.state.showRegisterCrewType})
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
    };


    submitForm = () => {
        CrewStore.createCrewMemberForEvent(() => {
            this.props.toggleRegisterCrewMember();
            this.props.submit();
        }, this.state.name, this.state.phone, this.state.email, this.state.description, this.state.selectedCategoryID, (this.state.isResponsible ? 1 : 0), EventStore.currentEvent.eventID, CookieStore.currentUserID);
    };

    submitCrewType = () => {
      Alert.success("Crew category added");
    };

    toggleShowCrewType = () => {
        this.setState({showRegisterCrewType : !this.state.showRegisterCrewType});
    };

    cancelRegister = () => {
        this.setState({name : "",
            phone : "",
            email : "",
            description: "",
            isResponsible: false});
        this.props.toggleRegisterCrewMember();
    };

}
