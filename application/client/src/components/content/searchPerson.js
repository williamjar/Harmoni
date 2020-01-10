import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FaSearch} from "react-icons/all";


export class SearchPeople extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchInput : "",
            results : [{input : "Lorde"}, {input : "lor"}],
        };


        this.handleSearchInput = this.handleSearchInput.bind(this);
    }

    render() {
        return(
            <div>
                <div className="row padding-top-20">
                    <div className="col-8">
                        <InputGroup>
                            <FormControl
                                placeholder="Søk"
                                aria-label="Søk"
                                aria-describedby="basic-addon2"
                                onChange={this.handleSearchInput}
                                className="rounded-pill"
                            />
                            <InputGroup.Append>
                                <div className="searchButtons">
                                <FaSearch/>
                                <Button variant="outline-secondary rounded">Registrer ny</Button>
                                </div>
                            </InputGroup.Append>
                        </InputGroup>

                        <div className="card-text margin-top-5">
                            {this.state.results.filter(e => this.state.searchInput.toLowerCase().indexOf(e.input.toLowerCase()) >= 0).map(show =>
                                <div className="card-title card-header search"> {show.input}</div>
                            )}


                            {<div className="card card-body">
                                Registrer ny artist

                                <div className="row padding-top-20">
                                    <div className="col-5">
                                        la
                                    </div>
                                </div>



                            </div>}
                        </div>



                    </div>
                </div>


            </div>
        )
    }

    handleSearchInput(event){
        this.setState({searchInput : event.target.value});



    }
}