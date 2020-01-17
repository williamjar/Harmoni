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
            numberOfFilesAdded: 0,
            riders : [],
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
                                onChange={this.handleInputRider}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" onClick={() => this.addRider()}>Legg til rider</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {this.state.riders.filter((rider) => rider.artistID === this.state.performer.artistID).map(e =>
                            <Rider description={e.description} isDone={e.isDone} status={e.status} riderObject={e}/>
                        )}


                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="signedContract"/>
                            <label className="form-check-label" htmlFor="signedContract">
                                Signert kontrakt
                            </label>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="performerPayed"/>
                            <label className="form-check-label" htmlFor="riderCompleted">
                                Betalt
                            </label>
                        </div>
                    </div>
                </div>

               <div className="row padding-top-20">



                   <div className="col-4">
                        <span className="btn btn-primary btn-file">
                            Legg til vedlegg <input type="file" multiple="multiple" id="uploadAttachmentPerformer" onChange={() => this.addFile()}/>
                        </span>
                       {this.state.numberOfFilesAdded > 0 && this.state.numberOfFilesAdded<2? <div className="padding-left-5">{this.state.numberOfFilesAdded + " file added"}</div>: null}
                       {this.state.numberOfFilesAdded > 1 ? <div className="padding-left-5">{this.state.numberOfFilesAdded + " files added"}</div>: null}

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
        this.setState(currentState);
    }

    addFile = () =>{
        /* For adding attachments to performer */

        let attachment = document.querySelector("#uploadAttachmentPerformer").files.length;
        if(attachment !== undefined){
            let currentState = this.state;
            currentState.numberOfFilesAdded = attachment;
            this.setState(currentState); // Get the number of files selected for upload, to be used for user GUI
        }
    };

    addRider = () =>{
        /* Adds rider to performer on current event */
        alert(this.state.riderInput);
        RiderStore.createNewRiderElement((newRider) => {
            RiderStore.allRidersForCurrentEvent.push(newRider); // Has been posted and returns a

            let currentState = this.state;
            currentState.riders = RiderStore.allRidersForCurrentEvent;
            this.setState(currentState);


        }, this.state.performer.artistID, EventStore.currentEvent.eventID, this.state.riderInput /*Description*/);
    };

    handleInputRider = (event) =>{
        /* Handles the rider input for new riders to be added to state variable */
        let currentState = this.state;
        currentState.riderInput = event.target.value;
        this.setState(currentState);
    };

    save = () => {
        /* Save function to gather all information in the Performer Card that needs to be stored */
        let genre = document.querySelector("#genreSelect").value;
        let signedContract = document.querySelector("#signedContract").checked;
        let payed = document.querySelector("#performerPayed").checked;

        alert("save clicked");

        this.state.riders.filter((rider) => rider.artistID === this.state.performer.artistID).map(rider => {
            if (rider.isModified){
                RiderStore.updateRider(() => {rider.isModified = false}, rider.riderID, rider.artistID, EventStore.currentEvent.eventID, rider.status, rider.isDone, rider.description);
            }
        });

        let json = {
            genreArtist : genre,
            signedContract : signedContract,
            payedArtist : payed,
        };
    }
}

export class Rider extends Component{
    /* This component shows information pertaining to one rider, it receives information thorugh props from
    * parent and displays it in this component  */

    constructor(props){
        super(props);

        this.state = {
            taskDone: false,
            status : "",
        };

    }

    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">

                    <div className="col-5">
                        {this.props.description}
                    </div>

                    <div className="col-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value={this.props.isDone} name="checkbox" onChange={this.handleInput}/>
                                <label className="form-check-label" htmlFor="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status"value={this.props.status} name="status" onChange={this.handleInput}/>
                    </div>

                </div>
            </div>
        )
    }



    handleInput = (event) =>{
        /* Gets the input from the status and checkbox and updates state */
        let currentState = this.state;



        if(event.target.name === "status"){
            currentState.status = event.target.value;

        }

        if(event.target.name === "checkbox"){
            currentState.taskDone = event.target.checked;
        }

        this.setState(currentState);
    }

    submit = () => {
        let riderID = this.props.riderObject.riderID;
        let artistID = this.props.riderObject.artistID;
        let description = this.props.riderObject.description;

        RiderStore.updateRider(() => {}, riderID, artistID, EventStore.currentEvent.eventID, this.state.status, this.state.taskDone, description);
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
            alert("Du har ikke fyllt inn alle feltene");
            //TODO: add better alert system
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
                <b className="card-title">Artister som er lagt til</b>

                    {this.props.performersAdded.map(p =>
                        <div className="card card-body pointer selection" onClick={() => this.showCard(p)}>
                        <div className="row">
                            <div className="col-10">
                                {p.contactName}
                            </div>

                            <div className="col-2">
                                <button className="btn-danger rounded" onClick={() => this.unAssignArtist(p)}>Slett</button>
                            </div>
                        </div>
                        </div>
                    )}

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