import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Card, Col} from "react-bootstrap";
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
import {MegaValidator} from "../../megaValidator";

/**
 * @class PerformerPanel
 * @classdesc Performerpanel is the edit page for artist in an event, this.state keeps track of which components
 * it should display at a given time and aso holds the performer who is selected for display on artist card, and also a
 * array (results) that is used to be searched against
 */
export class PerformerPanel extends Component{


    constructor(props){
        super(props);

        this.state = {
            performerList : [],
            showArtistCard: false,
            performerSelected : {},
            results : [],
            showRegisterNew : false,
            genrePerformerSelected : "",
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
                                    <button className="btn btn-success" onClick={this.toggleRegisterNew}>Registrer ny artist</button>
                                </div>
                            </div>

                            <div className="padding-top-20">
                                {this.state.showRegisterNew?<RegisterPerformer submitFunction={this.submitFunction} toggleRegister={this.toggleRegisterNew} />:null}
                                {this.state.showArtistCard?<PerformerCard performerSelected={this.state.performerSelected} genre={this.state.genrePerformerSelected} genreHandler={this.genreHandler} refreshPerformers={this.refreshPerformers}/>:null}
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="padding-top-30-mobile">
                            <RegisteredPerformers key={this.state.performerSelected} performersAdded={this.state.performerList} changeCard={this.changeCurrentPerformer} unAssignArtist={this.unAssignArtist}/>
                            </div>
                        </div>
                    </div>

            </div>
        );
    }

    /**
     * Changes genre for current performer
     * @param {genre}genre
     * An object with information about genre
     */
    genreHandler = (genre) => {
        this.setState({genrePerformerSelected : genre});
    };

    /**
     * Refreshes the array's of performers
     */
    refreshPerformers = () => {
        ArtistService.getArtistsForEvent((list) => {
            EventStore.currentEvent.artists = list;
            let currentState = this.state;
            currentState.performerList = list; //Receive a new array from database with assigned performer to event
            this.setState(currentState);
        }, EventStore.currentEvent.eventID);
    };

    /**
     * Sets the genreName for the current performer showing in performer card.
     * @param {performer}performer
     * An object of the type performer
     * @see Artist
     */
    setGenreCurrentPerformer = (performer) => {
        ArtistService.getAllGenres((res) => {
            res.map(e => {
                if(e.genreID === performer.genre){
                    this.setState({ genrePerformerSelected : e.genreName});
                }
                return 0;
            });
        });
    };

    /**
     * Removes the performer's association with the current event
     * @param {artist}artist
     * An object of the type performer
     * @see Artist
     */
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
                this.hideCard();
            }, EventStore.currentEvent.eventID);
        });
    };

    /**
     * Attaches an performer to the current event
     * @param {performer}selected
     * An object with information on performer
     * @see Artist
     */
    assignArtist = (selected) => {
        //Assign performer to event
        let currentState = this.state;
        ArtistService.assignArtist(EventStore.currentEvent.eventID, selected.artistID).then(res => {
           this.refreshPerformers();
        }).catch(res => console.log(res));
        currentState.performerSelected = selected;
        this.setState(currentState);
    };

    /**
     * Changes the current performer showing in PerformerCard
     * @param {performer}performer
     * An object with the information on performer
     */
    changeCurrentPerformer = (performer) => {
        //Changes the current performer to be showed in performer card
        let currentState = this.state;

        ArtistService.getArtistEventInfo((artistEventInfo) =>{
            currentState.performerSelected = performer;
            performer.hasBeenPaid = artistEventInfo.hasBeenPaid;
            performer.contractSigned = artistEventInfo.contractSigned;
            currentState.showArtistCard = true;
            currentState.showRegisterNew = false;
            this.setState(currentState);
            this.setGenreCurrentPerformer(performer);
        }, performer.artistID, EventStore.currentEvent.eventID);

    };

    componentDidMount() {
        this.callBackSearchResult();

        ArtistService.getArtistsForEvent((list) => {
            let currentState = this.state;
            currentState.performerList = list;
            EventStore.currentEvent.artists = list;
            this.setState(currentState);
        }, EventStore.currentEvent.eventID);


    };

    /**
     * Toggles the visibility of the Register form for Performer
     */
    toggleRegisterNew = () => {
        let currentState = this.state;
        currentState.showRegisterNew = !currentState.showRegisterNew;
        this.setState(currentState);
        this.hideCard();
    };


    /**
     * Hides the performer card
     */
    hideCard = () => {
        let currentState = this.state;
        currentState.showArtistCard = false;
        this.setState(currentState);
    };

    /**
     * Toggles the showing of performer card
     */
    toggleShowCard = () => {
        let currentState = this.state;
        currentState.showArtistCard = !currentState.showArtistCard;
        this.setState(currentState);
    };

    /**
     * Submit function to store information about artist, the call is submitted to database in parent component
     * @param {performer}artist
     * @see Artist, PerformerPanel
     */
    submitFunction = (artist) => {
        this.assignArtist(artist);
        this.callBackSearchResult();
        this.toggleRegisterNew();

    };

    /**
     * Updates the array with all registered performers added by organizer, not event specific.
     *This is is to be used with search to search against
     */
    callBackSearchResult = () => {
        artistService.getArtistForOrganizer((allArtistByOrganizer) => {
            let currentState = this.state;
            currentState.results = allArtistByOrganizer;
            this.setState(currentState);
        },CookieStore.currentUserID);
    };

    /**
     * This searchhandler is called when search result is selected
     * It then shows the performer card for that performer.
     * @param {performer}selected
     * An object with information about performer
     */
    searchHandler = (selected) => {
        let currentState = this.state;
        currentState.performerSelected = selected;
        currentState.showArtistCard = true;
        currentState.showRegisterNew = false;
        this.assignArtist(selected);
        this.setState(currentState);

        this.setGenreCurrentPerformer(selected);
    };

}

/**
 * @class PerformerCard
 * @classdesc PerformerCard is the card showing the current performer selected when on the EventPage, user is able to make changes to
 * performer and add riders
 */
export class PerformerCard extends Component{

    constructor(props){
        super(props);

        this.state = {
            performer : this.props.performerSelected,
            riderInput : "",
            numberOfFilesChosenForUpload: 0,
            numberOfFilesAlreadyUploaded: 0,
            riders : [],
            contractSigned : false,
            hasBeenPaid : false,
            genre : this.props.genre,
            genreList : [],
        };
    }

    render(){
        return(
            <Card>
                <Card.Body>
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
                        <select className="form-control" id="genreSelect" value={this.state.genre} onChange={this.genreHandler}>
                            {this.state.genreList.map(e =>
                                <option key={e.genreID}>{e.genreName}</option>
                            )}
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



                        {this.state.riders.map(e =>
                        {if(e.artistID === this.state.performer.artistID){
                            return <Rider key={e.riderElementID} description={e.description} isDone={e.isDone} status={e.status} riderObject={e} deleteRider={this.deleteRider}/>

                        } else {
                            return null
                        }}
                        )}
                            </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input " name="contractSigned" type="checkbox" checked={this.state.contractSigned} id="signedContract" onChange={this.handleOtherCheckboxes}/>
                            <label className="form-check-label" htmlFor="contractSigned">
                                Signert kontrakt
                            </label>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" name="hasBeenPaid" type="checkbox" checked={this.state.hasBeenPaid} id="performerPayed" onChange={this.handleOtherCheckboxes}/>
                            <label className="form-check-label" htmlFor="hasBeenPaid">
                                Betalt
                            </label>
                        </div>
                    </div>
                </div>


                   <Row className="mt-5">
                   <Col>
                        <span className="btn btn-secondary btn-file">
                            Legg til vedlegg <input type="file" id="uploadAttachmentPerformer" accept="application/pdf" onChange={() => this.addFile()}/>
                        </span>
                       {this.state.numberOfFilesAdded > 0 && this.state.numberOfFilesAdded<2? <div className="padding-left-5">{this.state.numberOfFilesAdded + " file added"}</div>: null}
                       {this.state.numberOfFilesAdded > 1 ? <div className="padding-left-5">{this.state.numberOfFilesAdded + " files added"}</div>: null}
                   </Col>

                   <Col>
                       <Button variant="primary" onClick={() => this.sendEmail()}>Send invitasjon</Button>
                   </Col>

                   <Col>
                       <Button variant="success" onClick={() => this.save()} id="savePerformer">Lagre informasjon</Button>
                   </Col>

                   </Row>

                <Row className="">
                    <Col>
                    Filer lagt til fra før: {this.state.numberOfFilesAlreadyUploaded}
                    </Col>
                </Row>

                </Card.Body>
            </Card>
        )
    }

    static getDerivedStateFromProps(props, state) {
        /* Updates the props based on parent state change
        * sets the current performer to be displayed in card */
        if(props.performerSelected !== state.performer) {
            return {
                performer: props.performerSelected,
                hasBeenPaid : props.performerSelected.hasBeenPaid,
                contractSigned : props.performerSelected.contractSigned,
            };
        }

        if(props.genre !== state.genre){
            return {
                genre : props.genre
            }
        }

        return null;
    }

    /**
     * Sets the genre for the current performer
     * @param {string}event
     * A string with the genreName to the current performer
     */
    genreHandler = (event) => {
      this.props.genreHandler(event.target.value);
    };

    componentDidMount() {
        //Fetches all riders for current artist and event and stores them in state

        ArtistService.getAllGenres((res) => {
            this.setState({genreList : res});
            RiderStore.storeAllRidersForEvent(() => {
                this.setState({riders : RiderStore.allRidersForCurrentEvent});
            }, EventStore.currentEvent.eventID);
        });
        this.setState({hasBeenPaid : this.state.performer.hasBeenPaid, contractSigned : this.state.performer.contractSigned, genre : this.state.performer.genre});

        //currentState.numberOfFilesAlreadyUploaded = currentState.performer.documents.length;

    }

    /**
     * Adds documents to performer, contracts, riders i.e.
     */
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
                formData.set('description', files[i].name);
                DocumentService.addDocument(EventStore.currentEvent.eventID, "Kontrakt", currentState.performer.artistID, null, 1, formData, (statusCode, returnData) => {
                    if (statusCode === 200){
                        Alert.success("Dokumentet ble lastet opp");
                        this.state.performer.addDocument(new Document(returnData.documentID, EventStore.currentEvent.eventID, files[i].name, returnData.documentLink, this.state.performer.artistID, null, 1));
                        fileInput.value = '';
                        currentState.numberOfFilesAlreadyUploaded += 1;
                        currentState.numberOfFilesAdded = 0;
                    }
                    else{
                        Alert.danger("En feil skjedde under opplastning");
                    }

                });
            }
            this.setState(currentState);
        }
    };

    /**
     * Removes rider from artist which is tied to event
     * @param {rider}rider
     * An object with information about rider
     */
    deleteRider = (rider) => {



        // For instant update

        //Update database
        RiderStore.deleteRider(() => {

            let currentState = this.state;
            let index = currentState.riders.indexOf(rider);
            currentState.riders.splice(index, 1);
            this.setState(currentState, () => {  RiderStore.allRidersForCurrentEvent = currentState.riders;});

        }, EventStore.currentEvent.eventID, rider.artistID, rider.riderID);
    };

    /**
     * Adds rider to artist, which is tied to event
     */
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

    /**
     * Handles the checkboxes 'Signed contract', 'Has been payed'
     * @param {event}event
     * An event with information whether checkbox is checked or not
     */
    handleOtherCheckboxes = (event) => {
        this.setState({[event.target.name] : event.target.checked});
    };

    /**
     * Handles the input on input form for rider and stores it in component state
     * @param {event}event
     * Event object with target value
     */
    handleInputRider = (event) =>{
        /* Handles the rider input for new riders to be added to state variable */
        let currentState = this.state;
        currentState.riderInput = event.target.value;
        this.setState(currentState);
    };

    /**
     * Sends email to the performer's email adress with a predefined message
     */
    sendEmail(){
        ArtistService.getArtistToken(this.state.performer.artistID, EventStore.currentEvent.eventID, (statusCode, token) => {
            if (statusCode === 200 && token){
                const linkFriendlyToken = token.replace(/\./g, "+");


                const emailBody = "Welcome!\nHere is your official invitation to " + EventStore.currentEvent.eventName + ".\n" +
                    "You have been invited by " + OrganizerStore.currentOrganizer.username + "\n" +
                    "And the event will be going from " + EventStore.currentEvent.startDate + " to " + EventStore.currentEvent.endDate + ".\n" +
                    "Enter this link into your browser to see your contract and edit your riders: \n" +
                    "http://localhost:3000/#/artistLogin/" + linkFriendlyToken + " " +
                    "Regards, " + OrganizerStore.currentOrganizer.username + " ";

                MailService.sendArtistInvitation(this.state.performer, "Official invitation to " + EventStore.currentEvent.eventName, emailBody
                    , (statusCode) => {
                        if (statusCode === 200){
                            Alert.info("E-post ble sendt til artisten med informasjon.");
                        }
                        else{
                            Alert.danger("En feil skjedde under sending av epost");
                        }
                    });
            }
            else{

            }
        });


    }

    /**
     * Gathers all information on performer card and saves it by submitting it to database
     */
    save = () => {
        /* Save function to gather all information in the Performer Card that needs to be stored */
        Alert.success("Artist lagret");
        this.state.riders.filter((rider) => rider.artistID === this.state.performer.artistID).map(rider => {
            if (rider.isModified){
                RiderStore.updateRider(() => {
                    rider.isModified = false;

                }, rider.riderID, rider.artistID, EventStore.currentEvent.eventID, rider.status, rider.isDone ? 1 : 0, rider.description);
            }
            return 0;
        });

        //TODO: Send signed contract and if artist has been hasBeenPaid
        artistService.updateArtistEventInfo(()=>{
        }, this.state.performer.artistID, EventStore.currentEvent.eventID, this.state.contractSigned, this.state.hasBeenPaid);

        let genreID = 0;

        this.state.genreList.map(e => {
           if(e.genreName === this.state.genre){
               genreID = e.genreID;
           }
           return 0;
        });

        artistService.updateArtistGenre(() => {
            this.props.refreshPerformers();
        }, this.state.performer.artistID, genreID,CookieStore.currentUserID, this.state.performer.contactID);

    }
}

/**
 * @class Rider
 * @classdesc Rider is the component that shows information pertaining to one rider, it receives information through props from
 * parent and displays it in this component
 */
export class Rider extends Component{


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
                            <input className="form-check-input" type="checkbox" checked={this.state.taskDone} name="taskDone" onChange={this.handleCheckBoxInput}/>
                                <label className="form-check-label" htmlFor="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status" value={this.state.status} name="status" onChange={this.handleStatusInput}/>
                    </div>

                    <div className="col-1">
                        <button className="btn btn-danger" onClick={this.deleteRider}><FaTrashAlt/></button>
                    </div>

                </div>
            </div>
        )
    }

    componentDidMount() {
        this.setState({taskDone : this.props.riderObject.isDone, status : this.props.riderObject.status});
    }

    /**
     * Handles the statusinput on rider card
     * @param {event}event
     * Has the string value of the input field
     */
    handleStatusInput = (event) => {
        this.setState({status : event.target.value}, () => {
            this.props.riderObject.status = this.state.status;
            this.props.riderObject.isModified = true;
        });
    };

    /**
     * Handles the checkbox if rider is complete
     * @param {event}event
     * Information on whether rider checkbox is checked or not
     */
    handleCheckBoxInput = (event) => {
        this.props.riderObject.isDone = event.target.checked;
        this.props.riderObject.isModified = true;
        this.setState({taskDone : this.props.riderObject.isDone});



    };

    /**
     * Removes rider from artist
     */
    deleteRider = () => {
        this.props.deleteRider(this.props.riderObject);
    }

}

/**
 * @class RegisterPerformer
 * @classdesc RegisterPerformer is the form card to register new performers
 */
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
          genre : "",
          genreList : [],
        };
    }

    /**
     * Validates forms
     * @returns {string}
     * String with error message
     */
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
            return 'Vennligst skriv in en epostadresse';
        }
        else{
            return '';
        }
    }

    render() {
        return(
            <div className="card card-body">
                    <Form.Row>

                        <Form.Group as={Col}>
                            <Form.Text><h4>Registrer kontaktinformasjon til artist</h4></Form.Text>
                        </Form.Group>
                    </Form.Row>
                
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Navn</Form.Label>
                            <Form.Control type="text" maxLength={"30"} placeholder="" onChange={this.handleNameChange}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="tel" maxLength={"8"} placeholder="" onChange={this.handlePhoneChange}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Epost</Form.Label>
                        <Form.Control type="email" placeholder="" onChange={this.handleEmailChange}/>
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Sjanger</Form.Label>
                            <Form.Control as="select" onChange={this.handleGenreChange}>
                                {this.state.genreList.map(genre =>
                                <option>{genre.genreName}</option>
                                )}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>


                    <div className="padding-top-20"></div>

                    <Row className="no-gutter">
                        <Col className="col-2">
                    <Button variant="primary" type="submit" disabled={!(this.validateForm()==='')} onClick={this.submitForm}>
                        Lagre
                    </Button>
                        </Col>
                        <Col className="col-2">
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegisterNew}>
                        Avbryt
                    </Button>
                        </Col>
                    </Row>
                <Form.Text className={"text-danger"}>{this.validateForm()}</Form.Text>
            </div>
        )
    }

    componentDidMount() {
        ArtistService.getAllGenres((res) => {
            this.setState({genreList : res, genre : res[0].genreName});
    });
    }

    /**
     * Handles the name change and store it in state
     * @param {event}event
     * Holds information on value from input field
     */
    handleNameChange = (event) => {
        //Updates state with name input field value
            let currentState = this.state;
            currentState.name = event.target.value;
            this.setState(currentState);
    };


    /**
     * Handles the phone number change and store it in state
     * @param {event}event
     * Holds information on value from input field
     */
    handlePhoneChange = (event) => {
        //Updates state with phone input field value
        let currentState = this.state;
        currentState.phone = event.target.value;
        this.setState(currentState);
    };

    /**
     * Handles the email adress change and store it in state
     * @param {event}event
     * Holds information on value from input field
     */
    handleEmailChange = (event) => {
        //Updates state with email input field value
        let currentState = this.state;
        currentState.email = event.target.value;
        this.setState(currentState);
    };

    /**
     * Handles the performer's genre change and store it in state
     * @param {event}event
     * Holds information on value from input field
     */
    handleGenreChange = (event) => {
        //Updates state with genre input field value
        let currentState = this.state;
        currentState.genre = event.target.value;
        this.setState(currentState);
    };

    /**
     * Clears all field on register new performer card
     */
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

    /**
     * Collects information from input fields and submits and stores them in database.
     */
    submitForm = () => {
        if(this.state.name.trim() !== "" && this.state.phone.trim() !== "" && this.state.email.trim() !== ""){
            /* Should check if valid as email address, not able to put type to email because it fucked eveything up */
            let tempList = this.state.genreList.filter(e => e.genreName === this.state.genre);
            let genreID = tempList[0].genreID;

            ArtistService.createArtist((artist) => {

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

/**
 * @class RegisteredPerformers
 * @classdesc RegisteredPerformers is a panel showing all artist assosicated with event
 */
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
                <div>Ingen artister er lagt til</div>
                :<b>Artister som er lagt til</b>}

                <ul className="list-group">
                    {this.props.performersAdded.map(p =>
                        <li key={p} className="list-group-item pointer selection" onClick={() => this.showCard(p)}>
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

    /**
     * Call to parent to unassign artist from event
     * @param {performer}artist
     * Object with information about performer
     */
    unAssignArtist = (artist) => {
        this.props.unAssignArtist(artist);
    };

    /**
     * Call to parent with performer object to show on performer card
     * @param performer
     */
    showCard = (performer) => {
        this.props.changeCard(performer);
    };
}