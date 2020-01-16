import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FaSearch} from "react-icons/all";
import Form from "react-bootstrap/Form";
import {Row, Col} from 'react-bootstrap';
import {ArtistService as artistService} from "../../store/artistService";
import {CookieStore} from "../../store/cookieStore";


export class Search extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchInput : "",
            showSearchResults: false,
            results : [this.props.results],
        };


        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }


    render() {
        return(
            <div>
                <div className="row">
                    <div className="col-12">
                        <InputGroup>
                            <FormControl
                                placeholder="Søk"
                                aria-label="Søk"
                                aria-describedby="basic-addon2"
                                onChange={this.handleSearchInput}
                                className="rounded-pill"
                            />
                        </InputGroup>

                        <div className="card-text margin-top-5 ma">
                            {this.state.showSearchResults && this.state.results != undefined?
                                this.state.results.filter(e => this.state.searchInput.toLowerCase().indexOf(e.contactName.toLowerCase()) > -1).map(show =>
                                <div className="card-title card-header search" onClick={() => this.searchHandler(show)}>{show.contactName}</div>
                                ):null}

                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        let currentState = this.state;
        currentState.results = this.props.results;
        this.setState(currentState);
    }


    static getDerivedStateFromProps(props, state) {
        if(props.results !== state.results) {
            return {
                results: props.results
            };
        }
        return null;
    }


    searchHandler(input){
        let currentState = this.state;
        currentState.showSearchResults = false;
        this.setState(currentState);
        this.props.searchHandler(input);
    }

    handleSearchInput(event){
        let currentState = this.state;
        currentState.showSearchResults = true;
        currentState.searchInput = event.target.value;
        this.setState(currentState);



    }
}

