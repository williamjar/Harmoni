import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

export class SearchPeople extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchInput : "",
            results : [{input : "Lorde"}],
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
                                placeholder="Search"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                                onChange={this.handleSearchInput}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary rounded">Legg til fra arkiv</Button>
                                <Button variant="outline-secondary rounded">Registrer ny</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        <div className="card">
                            {this.state.results.filter(e => this.state.searchInput.toLowerCase().indexOf(e.input.toLowerCase()) >= 0).map(show =>
                                <div className="card-title card-header"> {show.input}</div>
                            )}
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