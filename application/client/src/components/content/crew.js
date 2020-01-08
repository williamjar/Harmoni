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
                        <input className="form-check-input" type="checkbox" value="" id="signedContract"/>
                        <label className="form-check-label" htmlFor="signedContract">
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
                    <label for="descriptionCrew">Beskrivelse</label>
                    <textarea className="form-control" id="descriptionCrew" rows="4"></textarea>
                    </div>

                </div>

                <div className="row padding-top-20">
                    <div className="col-4">
                        <button className="btn-primary rounded">Legg til vedlegg</button>
                    </div>
                    <div className="col-4 offset-4 text-right">
                        <button className="btn-success rounded">Legg til</button>
                    </div>
                </div>

            </div>
        )
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