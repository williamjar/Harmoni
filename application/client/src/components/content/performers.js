import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {Search} from "./search";
import Form from "react-bootstrap/Form";
import {Col} from "react-bootstrap";


export class PerformersTab extends Component{

    constructor(props){
        super(props);

        this.state = {
            showArtistCard: false,
        };

        this.searchHandler = this.searchHandler.bind(this);
    }

    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-lg-6 col-md-12  border-right">
                        <PerformerPanel searchHandler={this.searchHandler} showCard={this.state.showArtistCard}/>
                    </div>

                    <div className="col-lg-6 col-md-12">
                        <RegisteredPerformers />
                    </div>
                </div>
            </div>
        )
    }

    searchHandler(selected){
        let personSelected = selected;
        let currentState = this.state;
        currentState.showArtistCard = true;
        this.setState(currentState);
    }
}

export class PerformerPanel extends Component{

    render() {
        return (
            <div>
                <Search searchHandler={this.props.searchHandler} registerComponent={<RegisterPerformer/>} addRegisterButton={true}/>
                <div className="padding-top-20">
                {this.props.showCard?<PerformerCard />:null}
                </div>
            </div>
        );
    }
}

export class PerformerCard extends Component{

    constructor(props){
        super(props);

        this.state = {
            riderInput : "",
            numberOfFilesAdded: 0,
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
                        Lorde<br/>
                        artist@hotmail.com
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

                        <Rider />
                        <Rider />

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
    }
    addRider = () =>{
        alert(this.state.riderInput);
    }

    handleInputRider = (event) =>{
        this.setState({riderInput: event.target.value});
    }

    save = () => {
        /* Gathers the input boxes and puts the information into variables */
        let genre = document.querySelector("#genreSelect").value;
        let signedContract = document.querySelector("#signedContract").checked;
        let payed = document.querySelector("#performerPayed").checked;
        alert("save clicked");

        let json = {
            genreArtist : genre,
            signedContract : signedContract,
            payedArtist : payed,
        };

    }
}

export class Rider extends Component{
    constructor(props){
        super(props);

        this.state = {
            taskDone: false,
            status : "",
        };

        this.handleInput = this.handleInput.bind(this);

    }

    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">

                    <div className="col-5">
                        Knekkebrød med ost
                    </div>

                    <div className="col-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="riderCompleted" onChange={this.handleInput}/>
                                <label className="form-check-label" htmlFor="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status" id="statusRider" onChange={this.handleInput}/>
                    </div>

                </div>
            </div>
        )
    }

    handleInput(event){
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
          name : "",
          phone : "",
          email : "",
          genre : "",  //Genre should be set from start
        };

    }

    render() {
        return(
            <div>
                <Form>
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
                        <Form.Control type="email" placeholder="" onChange={this.handleEmailChange}/>
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

                    <Button variant="primary" type="submit" onClick={this.submitForm}>
                        Submit
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5">
                        Cancel
                    </Button>

                </Form>
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

    submitForm = () => {
        //Error handling should be inserted here
        console.log(this.state);
    }
}

export class RegisteredPerformers extends Component{
    render(){
        return(
            <div>
                <b>Artister som er lagt til</b>
                <div className="card card-body">
                    <div className="row">
                        <div className="col-10">
                    Lorde
                        </div>

                        <div className="col-2">
                            <button className="btn-danger rounded">Slett</button>
                        </div>
                    </div>
                </div>
            </div>
        )
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