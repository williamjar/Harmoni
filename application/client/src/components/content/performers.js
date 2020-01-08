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
    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">

                    <div className="col-2">
                        <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50}/>
                    </div>

                    <div className="col-7">
                        Lorde<br/>
                        artist@hotmail.com
                    </div>

                    <div className="col-3">
                        <label for="genreSelect">Sjanger</label>
                        <select className="form-control" id="genreSelect">
                            <option>Blues</option>
                            <option>Country</option>
                        </select>
                    </div>

                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-12">
                        Riders<br/>

                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder=""
                                aria-label=""
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary">Legg til rider</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        <Riders/>
                        <Riders/>

                        <Riders/>

                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="signedContract"/>
                            <label className="form-check-label" for="signedContract">
                                Signert kontrakt
                            </label>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="performerPayed"/>
                            <label className="form-check-label" for="riderCompleted">
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
                       <button className="btn-success rounded">Lagre</button>
                   </div>
               </div>

            </div>
        )
    }
}

export class Riders extends Component{
    render(){
        return(
            <div className="card card-body">
                <div className="row align-items-center">

                    <div className="col-5">
                        Knekkebrød med ost
                    </div>

                    <div className="col-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="riderCompleted" />
                                <label className="form-check-label" for="riderCompleted">
                                    Utført
                                </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status" />
                    </div>

                </div>
            </div>
        )
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