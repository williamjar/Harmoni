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

export class PerformersTab extends Component{
    /* All the performer content for use in the Performer tab */

    constructor(props){
        super(props);

        this.state = {
            performersAdded : [],
            currentPerformer : {},
        }
    }

    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-lg-6 col-md-12  border-right">
                        <PerformerPanel addPerformer={this.addPerformer} performerSelected={this.state.currentPerformer}/>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <RegisteredPerformers performersAdded={this.state.performersAdded} changeCard={this.changeCurrentPerformer}/>
                    </div>
                </div>
            </div>
        )
    }

    addPerformer = (selected) => {
        let currentState = this.state;

        //currentState.performersAdded.push(selected);
        //assign artist to event
        ArtistService.assignArtist(EventStore.currentEvent.eventID, selected.artistID).then(res => {
            ArtistService.getArtistsForEvent((list) => {
                let currentState = this.state;
                currentState.performersAdded = list;
                console.log("artist assigned:");
                console.log(list);
                this.setState(currentState);
            }, EventStore.currentEvent.eventID);

            }

        )

        currentState.currentPerformer = selected;
        this.setState(currentState);
    }

    changeCurrentPerformer = (performer) => {
        let currentState = this.state;
        currentState.currentPerformer = performer;
        this.setState(currentState);
    }


}

export class PerformerPanel extends Component{
    /* Performerpanel is the left side in the PerformerTab, it is combined, because of the search and performercard. */

    constructor(props){
        super(props);

        this.state = {
            performerList : [],
            showArtistCard: false,
            performerSelected : {},
            results : [],
            showRegisterNew : true,
        }
    }

    render() {
        return (
            <div>
                <Search searchHandler={this.searchHandler} toggleRegister={() => this.toggleRegisterNew()} showRegisterNew={this.state.showRegisterNew} registerComponent={<RegisterPerformer submitFunction={this.submitFunction} toggleRegister={() => this.toggleRegisterNew()}/>} addRegisterButton={true} results={this.state.results} />
                <div className="padding-top-20">
                {this.state.showArtistCard?<PerformerCard performerSelected={this.state.performerSelected} />:null}
                </div>
            </div>
        );
    }


    static getDerivedStateFromProps(props, state) {
        if(props.performerSelected !== state.performerSelected) {
            return {
                performerSelected: props.performerSelected
            };
        }
        return state.performerSelected;
    }

    componentDidMount() {
        this.callBackSearchResult();
    }

    toggleRegisterNew = () => {
        let currentState = this.state;
        currentState.showRegisterNew = !currentState.showRegisterNew;
        this.setState(currentState);
    }

    submitFunction = () => {
        alert("submit clicked");
        this.callBackSearchResult();
        this.toggleRegisterNew();
    }

    callBackSearchResult = () => {
        artistService.getArtistForOrganizer((allArtistByOrganizer) => {
            let currentState = this.state;
            currentState.results = allArtistByOrganizer;
            this.setState(currentState);
        },CookieStore.currentUserID);
    }

    searchHandler = (selected) => {
        /* This searchhandler is called when search result is selected
        * It then shows the performer card for that performer.
        * */
        let currentState = this.state;
        currentState.performerSelected = selected;
        currentState.showArtistCard = true;
        this.props.addPerformer(selected);
        this.setState(currentState);
    }

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

        console.log(this.state);
    }

    static getDerivedStateFromProps(props, state) {
        if(props.performerSelected !== state.performer) {
            return {
                performer: props.performerSelected
            };
        }
        return null;
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

                        {this.state.riders.filter(filter => filter.artistID === this.state.currentPerformer.artistID).map(e =>
                            <Rider description={e.description} isDone={e.isDone} status={e.status}/>
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
                       <button className="btn-success rounded" onClick={() => this.save()}>Lagre</button>
                   </div>
               </div>

            </div>
        )
    }

    addFile = () =>{
        /*For adding attachments to crew */

        let attachment = document.querySelector("#uploadAttachmentPerformer").files.length;
        if(attachment !== undefined){
            let currentState = this.state;
            currentState.numberOfFilesAdded = attachment;
            this.setState(currentState); // Get the number of files selected for upload, to be used for user GUI
        }
    };

    addRider = () =>{
        alert(this.state.riderInput);
        RiderStore.createNewRiderElement((newRider) => {
            RiderStore.allRidersForCurrentArtistAndEvent.push(newRider);
            console.log(RiderStore.allRidersForCurrentArtistAndEvent);

            let currentState = this.state;
            currentState.riders = RiderStore.allRidersForCurrentArtistAndEvent;
            this.setState(currentState);
            console.log(this.state);
        }, this.state.performer.artistID, EventStore.currentEvent.eventID, this.state.riderInput /*Description*/);
    };

    handleInputRider = (event) =>{
        /* Handles the input for new riders to be added */
        let currentState = this.state;
        currentState.riderInput = event.target.value;
        this.setState(currentState);
    };

    save = () => {
        /* Gathers the input boxes and puts the information into variables */
        let genre = document.querySelector("#genreSelect").value;
        let signedContract = document.querySelector("#signedContract").checked;
        let payed = document.querySelector("#performerPayed").checked;
        let performer = this.state.performer;

        alert("save clicked");

        let json = {
            genreArtist : genre,
            signedContract : signedContract,
            payedArtist : payed,
        };

        console.log(json);

    }


}

export class Rider extends Component{
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
                            <input className="form-check-input" type="checkbox" value={this.props.isDone} id="riderCompleted" onChange={this.handleInput}/>
                                <label className="form-check-label" htmlFor="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status" id="statusRider" value={this.props.status} onChange={this.handleInput}/>
                    </div>

                </div>
            </div>
        )
    }

    handleInput = (event) =>{
        /* Gets the input from the status and checkbox */
        let completedTask = document.querySelector("#riderCompleted").checked;
        let status = document.querySelector("#statusRider").value;

        this.setState({taskDone: false, status: status});

        /* Need to post this state to database */
    }
}

export class RegisterPerformer extends Component{
    constructor(props){
        super(props);


        this.state = {
          addCategory : false,
          name : "",
          phone : "",
          email : "",
          genre : "",  //Genre should be set from start
        };

    }

    render() {
        return(
            <div>
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
                    <Button variant="primary" type="submit" onClick={this.submitForm}>
                        Submit
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5" onClick={this.cancelRegisterNew}>
                        Cancel
                    </Button>
            </div>
        )
    }

    handleNameChange = (event) => {
            let currentState = this.state;
            currentState.name = event.target.value;
            this.setState(currentState);
    }

    handlePhoneChange = (event) => {
        let currentState = this.state;
        currentState.phone = event.target.value;
        this.setState(currentState);
    }

    handleEmailChange = (event) => {
        let currentState = this.state;
        currentState.email = event.target.value;
        this.setState(currentState);
    }

    handleGenreChange = (event) => {
        let currentState = this.state;
        currentState.genre = event.target.value;
        this.setState(currentState);
    }

    cancelRegisterNew = () =>{
        let currentState = this.state;
        currentState.name = "";
        currentState.phone = "";
        currentState.email = "";
        currentState.genre = "";
        this.setState(currentState);
        this.props.toggleRegister();
    }

    submitForm = () => {
        //Error handling should be inserted here
        if(this.state.name.trim() !== "" && this.state.phone.trim() !== "" && this.state.email.trim() !== ""){
            /* Should check if valid as email adress, not able to put type to email because it fucked eveything up */
            let genreID = 1;
            alert("submit clicked");
            console.log(this.state.email);
            ArtistService.createArtist(() => {this.props.submitFunction();}, this.state.name, this.state.phone, this.state.email, genreID, CookieStore.currentUserID);
        } else{
            alert("Du har ikke fyllt inn alle feltene");
        }
    }
}

export class RegisteredPerformers extends Component{
    render(){
        return(
            <div>
                <b>Artister som er lagt til</b>

                    {this.props.performersAdded.map(p =>
                        <div className="card card-body pointer selection" onClick={() => this.showCard(p)}>
                        <div className="row">
                            <div className="col-10">
                                {p.contactName}
                            </div>

                            <div className="col-2">
                                <button className="btn-danger rounded">Slett</button>
                            </div>
                        </div>
                        </div>
                    )}

            </div>
        )
    }

    showCard = (performer) => {
        this.props.changeCard(performer);
    }
}

export class PerformersView extends Component {
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