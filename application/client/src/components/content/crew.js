import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export class Crew extends Component{
    render(){
        return(
            <div>
                <AddCrew />

                <AddedCrew />
            </div>
        )
    }
}

export class AddCrew extends Component{
    constructor(props){
        super(props);

        this.state = {
            numberOfFilesAdded: 0,
        };

    }



    render() {
        return(
            <div className="card card-body">
                <div className="row">
                    <div className="col-12">
                        Legg til ny
                    </div>
                </div>

                <div className="row padding-top-20 align-items-center">

                    <div className="col-4">

                    <select className="form-control" id="crewCategory">
                        <option>Lydperson</option>
                        <option>Lysperson</option>
                    </select>

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
                    <div className="col-6">
                        <InputGroup>
                            <FormControl
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary rounded">Legg til fra arkiv</Button>
                                <Button variant="outline-secondary rounded">Registrer ny</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>

                <div className="row padding-top-20">

                    <div className="col-12">
                    <label htmlFor="descriptionCrew">Beskrivelse</label>
                    <textarea className="form-control" id="descriptionCrew" rows="4"></textarea>
                    </div>

                </div>

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

    addFile(){
        /*For adding attachments to crew */


        let attachment = document.querySelector("#uploadAttachment").files.length;
        if(attachment != undefined){
            this.setState({numberOfFilesAdded: attachment,}); // Get the number of files selected for upload, to be used for user GUI
        }

    }

    addNew(){
        /* Fetches the information from the forms to be used with database */

        //TODO: Search bar is not functiong yet.
        let crewSelect = document.querySelector("#crewCategory").value;
        let mainResponsible = document.querySelector("#mainResponsible").checked;
        let description = document.querySelector("#descriptionCrew").value;
        let attachment = document.querySelector("#uploadAttachment").files;
    }
}

export class AddedCrew extends Component{
    render() {
        return (
            <div>
                <div className="row padding-top-20">
                    <div className="col-12">
                        <b>Personell som er lagt til</b>
                    </div>
                </div>

                <div className="row padding-top-20">
                    <div className="col-3">
                        <b>Lysperson</b>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card card-body">
                            Navn navnesen
                        </div>
                        <div className="card card-body">
                            Navn navnesen
                        </div>

                    </div>
                </div>

            </div>
        );
    }

}