import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";


export class Performers extends Component{
    render(){
        return(
            <div>
                <div className="row">

                    <div className="col-6 border-right">
                        <AddPerformer/>
                    </div>

                    <div className="col-6">
                        <RegisteredPerformers/>
                    </div>
                </div>
            </div>
        )
    }
}

export class AddPerformer extends Component{

    constructor(props){
        super(props);

        this.state = {
            riderInput : "",
        };

        this.handleInputRider = this.handleInputRider.bind(this);


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
                       <button className="btn-primary rounded">Legg til vedlegg</button>
                   </div>
                   <div className="col-4 offset-4 text-right">
                       <button className="btn-success rounded" onClick={() => this.save()}>Lagre</button>
                   </div>
               </div>

            </div>
        )
    }

    addRider(){
        alert(this.state.riderInput);
    }

    handleInputRider(event){
        this.setState({riderInput: event.target.value});
    }

    save(){
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