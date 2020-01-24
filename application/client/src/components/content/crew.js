import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import {CrewStore} from "../../store/crewStore";
import {OrganizerStore} from "../../store/organizerStore";
import {CookieStore} from "../../store/cookieStore";
import {EventStore} from "../../store/eventStore";
import Row from "react-bootstrap/Row";
import {Alert} from "../alerts";
import {MegaValidator} from "../../megaValidator";
import {MailService} from "../../store/mailService";

/**
 * @class CrewPanel
 * @classdesc Crewpanel is the edit page for crew members in an event, this.state keeps track of which components
 * it should display at a given time and also holds the crew member who is selected for display on crew card, show the
 * different crew categories added to the event and as well as an array (results) that is used to be searched against
 */
export class CrewPanel extends Component{

    constructor(props){
        super(props);

        this.state = {
            crewList : [],
            crewCategoryList : [],
            crewCategoryListEvent : [],
            showCrewCard: false,
            crewSelected : {},
            crewCategorySelected : null,
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
                                <Search searchHandler={this.searchHandler} results={this.state.results} />
                            </div>
                            <div className="col-4">
                                <button className="btn btn-success" onClick={this.toggleRegisterNew}>Registrer ny</button>
                            </div>
                        </div>

                        <div className="padding-top-20">
                            {this.state.showRegisterNew?<AddCrewMember submit={this.submitFunction} submitCategory={this.submitCategory} toggleRegisterCrewMember={this.toggleRegisterNew} crewCategoryList={this.state.crewCategoryList} />:null}
                            {this.state.showCrewCard?<CrewCard submitFunction={this.updateCrew} crewSelected={this.state.crewSelected} crewCategoryList={this.state.crewCategoryList} crewCategoryID={this.state.crewCategorySelected} categoryHandler={this.categoryHandler}/>:null}

                        </div>
                    </div>

                    <div className="col-lg-6 col-md-12">
                       <RegisteredCrew showRegisterCategory={this.props.showRegisterCategory} crewList={this.state.crewList} categoryList={this.state.crewCategoryListEvent} changeCard={this.changeCurrentCrew} refreshCategoryList={this.refreshCrewCategoriesForEvent} unassignCrew={this.unassignCrew}/>
                    </div>
                </div>

            </div>
        )
    }

    unassignCrew = (crew) => {
        //Unassign crew from event
        CrewStore.unassignCrewMemberFromEvent(EventStore.currentEvent.eventID, crew.crewCategoryID, crew.crewID, () => {}).then(res => {
            CrewStore.storeAllCrewMembersForEvent(() => {
                // updates the arrays that shows the current crew members added to event
                let currentState = this.state;
                currentState.crewList = CrewStore.allCrewForCurrentEvent; //Receive a new array from database with assigned crew member to event
                currentState.crewSelected = {};
                this.setState(currentState);
                this.toggleShowCard();
                this.refreshCrewCategoriesForEvent();
            }, EventStore.currentEvent.eventID);
        });
    };

    searchHandler = (selected) => {
        let currentState = this.state;
        currentState.crewSelected = selected;
        currentState.crewSelected.isResponsible = false;
        currentState.crewSelected.hasBeenPaid = false;
        currentState.crewSelected.contractSigned = false;
        currentState.crewCategorySelected = this.state.crewCategoryList[0].crewCategoryID;
        currentState.showCrewCard = true;
        this.hideRegisterNew();
        this.setState(currentState);
    };

    categoryHandler = (category) => {
        this.setState({crewCategorySelected : category});
    };

    componentDidMount() {
        this.refreshCrewList();
        this.refreshCrewCategories();
        this.refreshCrewCategoriesForEvent();
        this.callBackSearchResult();
    };

    toggleRegisterNew = () => {
        let currentState = this.state;
        currentState.showRegisterNew = !currentState.showRegisterNew;
        this.setState(currentState);
        this.hideCard();
    };

    toggleShowCard = () => {
        let currentState = this.state;
        currentState.showCrewCard = !currentState.showCrewCard;
        this.setState(currentState);
        this.hideRegisterNew();
    };

    hideCard = () => {
        let currentState = this.state;
        currentState.showCrewCard = false;
        this.setState(currentState);
    };

    hideRegisterNew = () => {
        let currentState = this.state;
        currentState.showRegisterNew = false;
        this.setState(currentState);
    };

    setCategoryCurrentCrew = () => {
        this.setState({
            crewCategorySelected : this.state.crewSelected.crewCategoryID
        })
    };

    refreshCrewList = () => {
        CrewStore.storeAllCrewMembersForEvent(() => {
            this.setState(
                { crewList : CrewStore.allCrewForCurrentEvent })
        }, EventStore.currentEvent.eventID);
    };

    refreshCrewCategories = () => {
        CrewStore.storeAllCrewCategoriesForOrganizer(() => {
            this.setState(
                {
                    crewCategoryList : CrewStore.allCrewCategoriesForOrganizer
                });
        }, CookieStore.currentUserID);
    };

    refreshCrewCategoriesForEvent = () => {
        CrewStore.storeAllCrewCategoriesForEvent(() => {
            this.setState(
                {
                    crewCategoryListEvent : CrewStore.allCrewCategoriesForCurrentEvent
                });
        }, EventStore.currentEvent.eventID);
    };

    submitFunction = (selected) => {
        let currentState = this.state;
        currentState.crewSelected = selected;
        this.setState(currentState);
        this.refreshCrewList();
        this.refreshCrewCategoriesForEvent();
    };

    updateCrew = (selected) => {
        let currentState = this.state;
        currentState.crewSelected = selected;
        this.setState(currentState);
        this.refreshCrewList();
        this.refreshCrewCategoriesForEvent();
        this.hideCard();
    };

    submitCategory = () => {
        this.refreshCrewList();
        this.refreshCrewCategories();
    };

    callBackSearchResult = () => {
        /* Updates the array with all registered crew members added by organizer, not event specific.
        *This is is to be used with search to search against */
        CrewStore.storeAllCrewMembersForOrganizer(() => {
            let currentState = this.state;
            currentState.results = CrewStore.allCrewMembersForOrganizer;
            this.setState(currentState);
        },CookieStore.currentUserID);
    };

    changeCurrentCrew = (crew) => {
        let currentState = this.state;
        currentState.crewSelected = crew;
        currentState.showCrewCard = true;
        currentState.showRegisterNew = false;
        this.setState(currentState);
        this.setCategoryCurrentCrew();
    };
}


/**
 * @class AddCrewType
 * @classdesc AddCrewType is an edit card for crew members where a new crew category can be added
 */
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
                    <Col className="col-2">
                        <Button variant="success" type="submit" onClick={this.submitForm}>
                            Lagre
                        </Button>
                    </Col>
                    <Col className="col-2">
                        <Button variant="secondary" type="cancel" className="padding-left-20" onClick={this.cancelButton}>
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
            Alert.warning("Du kan ikke ha en blank kategori");
        } else{
            CrewStore.addCategory(this.state.crewType, CookieStore.currentUserID);
            Alert.success("Kategorien " + this.state.crewType + " har blitt lagt til");
            this.props.submit();
        }
    };
}

/**
 * @class CrewCard
 * @classdesc CrewCard is a card for crew members in an event, where the organizer can assign members from the crew catalogue
 * and see assigned category and contact on already added members. General contact info and status is also available in
 * the CrewCard
 */
export class CrewCard extends Component{
    /* Crew card that shows information about crew members */

    constructor(props){
        super(props);

        this.state = {
            crew : this.props.crewSelected,
            crewCategoryList : this.props.crewCategoryList,
            crewCategoryID : this.props.crewCategoryID,
            crewCategoryName : this.props.crewSelected.crewCategoryName,
            description : this.props.crewSelected.description,
            isResponsible : this.props.crewSelected.isResponsible,
            contractSigned : this.props.crewSelected.contractSigned,
            hasBeenPaid : this.props.crewSelected.contractSigned
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

                    <div className="col-4">
                        <label htmlFor="categorySelect">Kategori</label>
                        <select className="form-control" id="categorySelect" value={this.state.crewCategoryID} onChange={this.categoryHandler}>
                            {this.state.crewCategoryList.map(e =>
                                <option key={e.crewCategoryID} value={e.crewCategoryID}>{e.crewCategoryName}</option>
                            )}
                        </select>
                    </div>

                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-12">
                        Beskrivelse<br/>
                    </div>

                        <div className="col-12">
                            <input type="text" className="form-control" value={this.state.description} id="description" onChange={this.handleInputDescription}/>
                        </div>


                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="contractSigned" type="checkbox" checked={this.state.contractSigned} id="contractSigned" onChange={this.handleCheckboxes}/>
                            <label className="form-check-label" htmlFor="contractSigned">
                                Mottatt bekreftelse
                            </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="hasBeenPaid" type="checkbox" checked={this.state.hasBeenPaid} id="crewPaid" onChange={this.handleCheckboxes}/>
                            <label className="form-check-label" htmlFor="crewPaid">
                                Betalt
                            </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="isResponsible" type="checkbox" checked={this.state.isResponsible} id="crewIsResponsible" onChange={this.handleCheckboxes}/>
                            <label className="form-check-label" htmlFor="crewIsResponsible">
                                Hovedansvarlig
                            </label>
                        </div>
                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-5">
                        <button className = "btn btn-primary" onClick={() => this.sendEmail()}>Send email med forespørsel</button>
                    </div>

                    <div className="col-5">
                        <button className="btn btn-success" onClick={() => this.updateCrewMember()} id="saveCrew">Lagre informasjon</button>
                    </div>
                </div>

            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current crew to be displayed in card */
        if(props.crewSelected !== state.crew) {
            return {
                crew: props.crewSelected,
                crewCategoryID : props.crewCategoryID,
                crewCategoryName : props.crewSelected.crewCategoryName,
                description : props.crewSelected.description,
                isResponsible : props.crewSelected.isResponsible,
                contractSigned : props.crewSelected.contractSigned,
                hasBeenPaid: props.crewSelected.hasBeenPaid
            };
        }
        if(state.crewCategoryID < 1){
            return{
                crewCategoryID : props.crewCategoryList[0].crewCategoryID
            }
        }
        return null;
    }

    categoryHandler = (event) => {
        this.setState({
            crewCategoryID : event.target.value
        });
        this.props.categoryHandler(event.target.value);
    };

    handleCheckboxes = (event) => {
        this.setState({[event.target.name] : event.target.checked});
    };

    handleInputDescription = (event) =>{
        /* Handles the description input for crew members */
        this.setState({description : event.target.value}, () => {
            this.props.crewSelected.description = this.state.description;
        });
    };

    updateCrewMember = () =>{
        this.setState({
            description : this.props.crewSelected.description
        }, () => {
            CrewStore.updateCrewMember(this.props.crewSelected.description, this.props.crewSelected.crewID);
        });

        this.setState({
            isResponsible : (this.state.isResponsible ? 1 : 0),
            contractSigned : (this.state.contractSigned ? 1 : 0),
            hasBeenPaid : (this.state.hasBeenPaid ? 1 : 0)
        }, () => {
            CrewStore.unassignCrewMemberFromEvent(EventStore.currentEvent.eventID, this.props.crewSelected.crewCategoryID, this.props.crewSelected.crewID, () => {
                CrewStore.assignCrewMemberToEvent(EventStore.currentEvent.eventID, this.state.crewCategoryID, this.props.crewSelected.crewID, this.state.isResponsible, this.state.contractSigned, this.state.hasBeenPaid , (crew) => {
                    this.props.submitFunction(crew);
                });
            });
        });
    };

    sendEmail(){
        MailService.sendGeneralEmailToOne(this.props.crewSelected.email, "Event plan", "You have been invited to work on " + EventStore.currentEvent.eventName + " by " + OrganizerStore.currentOrganizer.contactName +
            ". If you have any questions you can contact us on phone no.: " + OrganizerStore.currentOrganizer.phone + " or email: " + OrganizerStore.currentOrganizer.email + ". Welcome!", null, (status, data) => {
            if(status === 200){
                Alert.info("Email ble sendt til " + this.props.crewSelected.contactName);
            } else{
                Alert.danger("Email ble ikke sendt. Sjekk at emailen er korrekt.");
            }
        });
    }
}

/**
 * @class AddCrewMember
 * @classdesc AddCrew member is a component that registers new crew members. Category must be selected, and the
 * crew member will automatically be assigned to the current event. Crew members created in this component will be
 * added to the organizer's catalogue and they can be assigned to other events in other categories.
 */
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
            selectedCategoryID: null,
            crewCategoryList: []
        };
    }

    validateForm(){

        if(!MegaValidator.validateUsernameLength(this.state.name)){
            return 'Vennligst skriv inn et navn';
        }
        if(!MegaValidator.validateUsername("none", this.state.name)){
            return 'Navnet kan bare inneholde bokstaver';
        }
        if(!MegaValidator.validatePhoneNumberLength(this.state.phone)){
            return 'Telefonnummer er ikke gyldig';
        }
        if(!MegaValidator.validateEmailLength("none", this.state.email)){
            return 'Vennligst skriv in en epost-adresse';
        }
        if(this.state.selectedCategoryID < 1){
            return 'Vennligst velg en kategori';
        }
        else{
            return '';
        }
    }

    render() {
        return(
            <div className="card card-body">
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
                            <Col size={1}>
                                <Form.Label>Velg personell-type</Form.Label>
                                {this.state.selectedCategoryID === null?
                                    <div>Ingen kategorier er lagt til</div>
                                    :
                                <select className="form-control" value={this.state.selectedCategoryID} onChange={this.handleCategoryChange}>
                                    {this.state.crewCategoryList.map(category => (
                                        <option key={category.crewCategoryID} value={category.crewCategoryID}>
                                            {category.crewCategoryName}
                                        </option>
                                    ))}
                                </select>}
                            </Col>
                        </Row>
                        <Row>
                            <Col size={1}>
                                <button className="btn btn-success margin-top-20" onClick={this.toggleRegisterCrewTypeForm}>Ny kategori</button>
                            </Col>
                        </Row>
                    </Form.Group>

                    {this.state.showRegisterCrewType?
                        <div className="padding-bottom-20">
                            <AddCrewType submit={this.submitCrewType} cancelButton={this.toggleRegisterCrewTypeForm}/>
                        </div>
                        :null}

                    <Form.Group>
                        <input type="checkbox" onClick={this.handleIsResponsibleChange} className="margin-right-10"/>
                        <Form.Label>Hovedansvarlig</Form.Label>
                    </Form.Group>

                    <Row className="no-gutter">
                        <Col className="col-2">
                        <Button variant="primary" type="button" disabled={!(this.validateForm()==='')} onClick={this.submitForm}>
                            Lagre
                        </Button>
                        </Col>
                        <Col className="col-2">
                        <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegister}>
                            Avbryt
                        </Button>
                        </Col>
                    </Row>
                <Form.Text className={"text-danger"}>{this.validateForm()}</Form.Text>
            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current performer to be displayed in card */
        if(props.crewCategoryList.length === 0) {
            return {
                crewCategoryList: [],
                selectedCategoryID : null
            };
        }
        else if((props.crewCategoryList.length !== 0) && (props.crewCategoryList !== state.crewCategoryList) && (state.selectedCategoryID === null)) {
            return {
                crewCategoryList: props.crewCategoryList,
                selectedCategoryID : props.crewCategoryList[0].crewCategoryID
            };
        }
        else if ((props.crewCategoryList.length !== 0) && (props.crewCategoryList !== state.crewCategoryList)) {
            return {
                crewCategoryList: props.crewCategoryList,
                selectedCategoryID : props.crewCategoryList[props.crewCategoryList.length - 1].crewCategoryID
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
        let currentState = this.state;
        currentState.isResponsible = event.target.checked;
        this.setState(currentState);
    };

    handleCategoryChange = (event) =>{
        let currentState = this.state;
        currentState.selectedCategoryID = event.target.value;
        this.setState(currentState);
    };

    submitForm = () => {
        if(this.state.name.trim() !== "" && this.state.phone.trim() !== "" && this.state.email.trim() !== ""){
            CrewStore.createCrewMemberForEvent((crew) => {
                this.props.toggleRegisterCrewMember();
                this.props.submit(crew);
            }, this.state.name, this.state.phone, this.state.email, this.state.description, this.state.selectedCategoryID, (this.state.isResponsible ? 1 : 0), EventStore.currentEvent.eventID, CookieStore.currentUserID);
        }
        else{
            if(this.state.name.trim() === ""){
                Alert.warning("Navn må være fylt ut");
            }

            if(this.state.phone.trim() === ""){
                Alert.warning("Telefon må være fylt ut");
            }

            if(this.state.email.trim() === ""){
                Alert.warning("Email må være fylt ut");
            }
        }
    };

    submitCrewType = () => {
        this.props.submitCategory();
        this.toggleShowCrewType();
    };

    toggleShowCrewType = () => {
        this.setState({showRegisterCrewType : !this.state.showRegisterCrewType});
    };

    cancelRegister = () => {
        this.setState({
            name : "",
            phone : "",
            email : "",
            description: "",
            isResponsible: false});
        this.props.toggleRegisterCrewMember();
    };
}

/**
 * @class RegisteredCrew
 * @classdesc Registered crew is a component that shows the registered crew members to a specific event
 * Takes in props:
 * -this.props.categoryList : array to map the categories.
 * -this.props.crewList : array to map crew members.
 * -this.props.unassignCrew - send crew object to parent, Removes crew member from event.
 * -this.props.refreshCategoryList - refreshes the category list
 * -this.propschangeCard - send crew object to parent to display in crew card.
 */
export class RegisteredCrew extends Component{


    render() {
        if ((this.props.crewList === null) || (this.props.categoryList === undefined)) {
            return null;
        } else {
            return (
                <div>
                    {this.props.crewList.length === 0 ?
                    <div>Personell er ikke lagt til</div>
                    : null }
                    {this.props.categoryList.map(e => (
                        <ul key={e.crewCategoryID} className="list-group">
                            <b className="card-title">{e.crewCategoryName}</b>
                            {this.props.crewList !== undefined ? this.props.crewList.filter(c => c.crewCategoryName === e.crewCategoryName).map(c => (
                                <li key={c.crewCategoryID} className="list-group-item pointer selection" onClick={() => {
                                    this.showCard(c)
                                }}>
                                    <div className="row">
                                        <div className="col-10">
                                            {c.contactName}
                                        </div>

                                        <div className="col-10">
                                            {c.isResponsible ? "Hovedansvalig" : null}
                                        </div>

                                        <div className="col-2 text-right">
                                            <button className="btn-danger rounded"
                                                    onClick={() => this.unassignCrew(c)}>Slett
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            )) : null}
                        </ul>
                    ))}
                </div>
            )
        }
    }

    unassignCrew = (crew) => {
        //Call to parent with crew object to remove from event.
        this.props.unassignCrew(crew);
        this.props.refreshCategoryList();
    };

    showCard = (crew) => {
        this.props.changeCard(crew);
    };
}
