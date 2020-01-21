import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";
import {ArtistService as artistService, ArtistService} from "../../store/artistService";
import {CookieStore} from "../../store/cookieStore";
import {RiderStore} from "../../store/riderStore";
import {EventStore} from "../../store/eventStore";
import Row from "react-bootstrap/Row";
import {FaTrashAlt} from "react-icons/all";
import {MailService} from "../../store/mailService";
import {OrganizerStore} from "../../store/organizerStore";
import {DocumentService} from "../../store/documentService";
import {Document} from "../../classes/document";
import {Alert} from '../alerts.js';


export class PerformerPanel extends Component{
    /* Performerpanel is the edit page for artist in an event, this.state keeps track of which components
    * it should display at a given time and aso holds the performer who is selected for display on artist card, and also a
    * array (results) that is used to be searched against  */

    constructor(props){
        super(props);

        this.state = {
            performerList : [],
            showArtistCard: false,
            performerSelected : {},
            results : [],
            showRegisterNew : false,
        }
    }

    render() {
        return (
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
                                {this.state.showRegisterNew?<RegisterPerformer submitFunction={this.submitFunction} toggleRegister={this.toggleRegisterNew} />:null}
                                {this.state.showArtistCard?<PerformerCard performerSelected={this.state.performerSelected}/>:null}
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <RegisteredPerformers performersAdded={this.state.performerList} changeCard={this.changeCurrentPerformer} unAssignArtist={this.unAssignArtist}/>
                        </div>
                    </div>

            </div>
        );
    }


    unAssignArtist = (artist) => {
        // Unassign performer from event
        ArtistService.unAssignArtist(EventStore.currentEvent.eventID, artist.artistID).then(res => {
            ArtistService.getArtistsForEvent((list) => {
                // updates the arrays that shows the current performers added to event
                let currentState = this.state;
                currentState.performerList = list; //Receive a new array from database with assigned performer to event
                currentState.performerSelected = {};
                EventStore.currentEvent.artists = list;
                this.setState(currentState);
                this.toggleShowCard();
            }, EventStore.currentEvent.eventID);
        });
    };

    assignArtist = (selected) => {
        //Assign performer to event
        let currentState = this.state;
        ArtistService.assignArtist(EventStore.currentEvent.eventID, selected.artistID).then(res => {
                ArtistService.getArtistsForEvent((list) => {
                    EventStore.currentEvent.artists = list;
                    let currentState = this.state;
                    currentState.performerList = list; //Receive a new array from database with assigned performer to event
                    this.setState(currentState);
                }, EventStore.currentEvent.eventID);
            }
        );
        currentState.performerSelected = selected;
        this.setState(currentState);
    };

    changeCurrentPerformer = (performer) => {
        //Changes the current performer to be showed in performer card
        let currentState = this.state;
        currentState.performerSelected = performer;
        currentState.showArtistCard = true;
        this.setState(currentState);
    };

    componentDidMount() {
        this.callBackSearchResult();
        ArtistService.getArtistsForEvent((list) => {
            let currentState = this.state;
            currentState.performerList = list;
            currentState.performerSelected = {};
            EventStore.currentEvent.artists = list;
            this.setState(currentState);
        }, EventStore.currentEvent.eventID);
    };

    toggleRegisterNew = () => {
        let currentState = this.state;
        currentState.showRegisterNew = !currentState.showRegisterNew;
        this.setState(currentState);
        this.hideCard();
    };

    hideCard = () => {
        let currentState = this.state;
        currentState.showArtistCard = false;
        this.setState(currentState);
    };

    toggleShowCard = () => {
        let currentState = this.state;
        currentState.showArtistCard = !currentState.showArtistCard;
        this.setState(currentState);
    };

    submitFunction = (artist) => {
        console.log("artist mottatt");
        console.log(artist);
        this.assignArtist(artist);
        this.callBackSearchResult();
        this.toggleRegisterNew();

    };

    callBackSearchResult = () => {
        /* Updates the array with all registered performers added by organizer, not event specific.
        *This is is to be used with search to search against */
        artistService.getArtistForOrganizer((allArtistByOrganizer) => {
            let currentState = this.state;
            currentState.results = allArtistByOrganizer;
            this.setState(currentState);
        },CookieStore.currentUserID);
    };

    searchHandler = (selected) => {
        /* This searchhandler is called when search result is selected
        * It then shows the performer card for that performer. */
        let currentState = this.state;
        currentState.performerSelected = selected;
        currentState.showArtistCard = true;
        this.assignArtist(selected);
        this.setState(currentState);
    };

}

export class PerformerCard extends Component{
    /* Performer card that shows information about artist and riders connected to it */

    constructor(props){
        super(props);

        this.state = {
            performer : this.props.performerSelected,
            riderInput : "",
            numberOfFilesChosenForUpload: 0,
            numberOfFilesAlreadyUploaded: 0,
            riders : [],
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
                        {this.state.performer.contactName}<br/>
                        {this.state.performer.email}
                    </div>

                    <div className="col-3">
                        <label htmlFor="genreSelect">Sjanger</label>
                        <select className="form-control" id="genreSelect">
                            <option>Blues</option>
                            <option>Country</option>
                        </select>
                    </div>


                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-12">
                        Legg til rider<br/>

                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder=""
                                aria-label=""
                                aria-describedby="basic-addon2"
                                value={this.state.riderInput}
                                onChange={this.handleInputRider}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => this.addRider()}>Legg til rider</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {this.state.riders.filter((rider) => rider.artistID === this.state.performer.artistID).map(e =>
                            <Rider description={e.description} isDone={e.isDone} status={e.status} riderObject={e} deleteRider={this.deleteRider}/>
                        )}


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
                            <input className="form-check-input" name="payed" type="checkbox" checked={this.state.payed} id="performerPayed" onChange={this.handleOtherCheckboxes}/>
                            <label className="form-check-label" htmlFor="performerPayed">
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
                       <button className = "butn-success-rounded" onClick={() => this.sendEmail()}>Send offisiell invitasjon til artist</button>
                   </div>

                   <div className="col-4 offset-4 text-right">
                       <button className="btn-success rounded" onClick={() => this.save()} id="savePerformer">Lagre</button>
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
        //Fetches all riders for current artist and event and stores them in state
        let currentState = this.state;
        currentState.riders = RiderStore.allRidersForCurrentEvent;
        currentState.numberOfFilesAlreadyUploaded = currentState.performer.documents.length;

        ArtistService.getArtistEventInfo((artistEventInfo) =>{
            currentState.signedContract = artistEventInfo.contractSigned;
            currentState.payed = artistEventInfo.hasBeenPaid;
            console.log("artistEventInfo hasBeen Paid: " + artistEventInfo.hasBeenPaid);
            this.setState(currentState);
        }, currentState.performer.artistID, EventStore.currentEvent.eventID);
    }

    //TODO: Change states that show if files are added to server
    addFile = () =>{
        /* For adding attachments to performer */
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

    deleteRider = (rider) => {
        RiderStore.deleteRider(() => {
            let currentState = this.state;
            RiderStore.allRidersForCurrentEvent.splice(rider, 1);
            this.setState(currentState);
        }, EventStore.currentEvent.eventID, rider.artistID, rider.riderID);
    };

    addRider = () =>{
        /* Adds rider to performer on current event */
        if(this.state.riderInput.trim() !== ""){
            RiderStore.createNewRiderElement((newRider) => {
                RiderStore.addToAllRidersForCurrentArtistAndEvent(newRider); // Has been posted and returns a

                let currentState = this.state;
                currentState.riders = RiderStore.allRidersForCurrentEvent;
                currentState.riderInput = "";
                this.setState(currentState);

            }, this.state.performer.artistID, EventStore.currentEvent.eventID, this.state.riderInput /*Description*/);
        } else{
            Alert.danger("Rider kan ikke være blank");
        }

    };

    handleOtherCheckboxes = (event) => {
        this.setState({[event.target.name] : event.target.checked});
    };

    handleInputRider = (event) =>{
        /* Handles the rider input for new riders to be added to state variable */
        let currentState = this.state;
        currentState.riderInput = event.target.value;
        this.setState(currentState);
    };

    sendEmail(){
        console.log("Sending email to");
        console.log(this.state.performer);
        MailService.sendArtistInvitation(this.state.performer, "Official invitation to " + EventStore.currentEvent.eventName,
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
        });
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

        artistService.updateArtistEventInfo(()=>{}, this.state.performer.artistID, EventStore.currentEvent.eventID, this.state.signedContract, this.state.payed);
    }
}

export class Rider extends Component{
    /* This component shows information pertaining to one rider, it receives information thorugh props from
    * parent and displays it in this component  */

    constructor(props){
        super(props);

        this.state = {
            taskDone: this.props.riderObject.isDone,
            status : this.props.riderObject.status,
        };

    }

    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">

                    <div className="col-4">
                        {this.props.description}
                    </div>

                    <div className="col-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" checked={this.state.taskDone} name="taskDone" onChange={this.handleInput}/>
                                <label className="form-check-label" htmlFor="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status"value={this.state.status} name="status" onChange={this.handleInput}/>
                    </div>

                    <div className="col-1">
                        <button className="btn btn-danger" onClick={this.deleteRider}><FaTrashAlt/></button>
                    </div>

                </div>
            </div>
        )
    }



    handleInput = (event) =>{
        /* Gets the input from the status and checkbox and updates state */
        this.setState({[event.target.name] : event.target.name.trim() === "status"? event.target.value: event.target.checked});

        this.props.riderObject.status = this.state.status;
        this.props.riderObject.isDone = this.state.taskDone;

        this.props.riderObject.isModified = true;
    };

    deleteRider = () => {
        this.props.deleteRider(this.props.riderObject);

    }

}

export class RegisterPerformer extends Component{
    /* Component that has the form to register a new performer.
    * Takes in props:
    * -this.props.toggleFunction - To toggle display of register component
    * -this.props.submitFunction - To tell parent to update it's arrays. */

    constructor(props){
        super(props);
        this.state = {
          name : "",
          phone : "",
          email : "",
          genre : "",  //Genre should be set from start
        };
    }

    render() {
        return(
            <div className="card card-body">
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Navn</Form.Label>
                            <Form.Control type="name" placeholder="" onChange={this.handleNameChange}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="phone" placeholder="" onChange={this.handlePhoneChange}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Epost</Form.Label>
                        <Form.Control type="text" placeholder="" onChange={this.handleEmailChange}/>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Sjanger</Form.Label>
                            <Form.Control as="select" onChange={this.handleGenreChange}>
                                <option>Country</option>
                                <option>Blues</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>


                    <div className="padding-top-20"></div>

                    <Row className="no-gutter">
                        <Col className="col-2">
                    <Button variant="primary" type="submit" onClick={this.submitForm}>
                        Submit
                    </Button>
                        </Col>
                        <Col className="col-2">
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegisterNew}>
                        Cancel
                    </Button>
                        </Col>
                    </Row>
            </div>
        )
    }

    handleNameChange = (event) => {
        //Updates state with name input field value
            let currentState = this.state;
            currentState.name = event.target.value;
            this.setState(currentState);
    };

    handlePhoneChange = (event) => {
        //Updates state with phone input field value
        let currentState = this.state;
        currentState.phone = event.target.value;
        this.setState(currentState);
    };

    handleEmailChange = (event) => {
        //Updates state with email input field value
        let currentState = this.state;
        currentState.email = event.target.value;
        this.setState(currentState);
    };

    handleGenreChange = (event) => {
        //Updates state with genre input field value
        let currentState = this.state;
        currentState.genre = event.target.value;
        this.setState(currentState);
    };

    cancelRegisterNew = () =>{
        /* Clears all fields in the register form and toggles display of component */
        let currentState = this.state;
        currentState.name = "";
        currentState.phone = "";
        currentState.email = "";
        currentState.genre = "";
        this.setState(currentState);
        this.props.toggleRegister();
    };

    submitForm = () => {
        if(this.state.name.trim() !== "" && this.state.phone.trim() !== "" && this.state.email.trim() !== ""){
            /* Should check if valid as email address, not able to put type to email because it fucked eveything up */
            let genreID = 1;
            console.log(this.state.email);
            ArtistService.createArtist((artist) => {
                console.log("received artist");
                console.log(artist);
                this.props.submitFunction(artist); // Call to parent to update it's information in state.
                }, this.state.name, this.state.phone, this.state.email, genreID, CookieStore.currentUserID);
        } else{
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
}

export class RegisteredPerformers extends Component{
    /* Component that shows the registered performers to an specific event
    * Takes in props:
    * -this.props.performersAdded : array to map against.
    * -this.props.unAssignArtist - send performer object to parent, Removes performer from event.
    * -this.changeCard - send performer object to parent to display in performer card. */

    render(){
        return(
            <div>
                {this.props.performersAdded.length === 0?
                <div>Ingen artister er lagt</div>
                :<b className="card-title">Artister som er lagt til</b>}

                <ul className="list-group">
                    {this.props.performersAdded.map(p =>
                        <li className="list-group-item pointer selection" onClick={() => this.showCard(p)}>
                        <div className="row">
                            <div className="col-10">
                                {p.contactName}
                            </div>

                            <div className="col-2 text-right">
                                <button className="btn-danger rounded" onClick={() => this.unAssignArtist(p)}>Slett</button>
                            </div>
                        </div>
                        </li>
                    )}
                   </ul>

            </div>
        )
    }

    unAssignArtist = (artist) => {
        //Call to parent with performer object to remove from event.
        this.props.unAssignArtist(artist);
    };

    showCard = (performer) => {
        //Call to parent with selected performer to show performer card
        this.props.changeCard(performer);
    };
}

export class PerformersView extends Component {
    /* View component of registered artist to event */

    render() {
        return(
            <div>
                <b>Artister som er lagt til</b>
                <div className="card card-body">
                    <div className="row">
                        <div className="col-10">
                            Lorde
                        </div>

                        <div className="col-2">
                            <button className="btn-primary rounded mr-2">Vis artist</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}