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
            registerNewButtonAdded : this.props.addRegisterButton,
            searchInput : "",
            results : [],
            showRegisterNew : false,
            showSearchResults: true,
            showPerformerCard: false,
        };


        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.registerNew = this.registerNew.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }

    componentDidMount() {
        this.callBackSearchResult();
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
                            <InputGroup.Append>
                                <div className="searchButtons">
                                    {this.state.registerNewButtonAdded? <FaSearch/>:<div className="padding-top-5"> <FaSearch/></div> }
                                    {this.state.registerNewButtonAdded?<Button variant="outline-secondary rounded" onClick={this.registerNew}>Registrer ny</Button>:null}
                                </div>
                            </InputGroup.Append>
                        </InputGroup>

                        <div className="card-text margin-top-5 ma">
                            {this.state.showRegisterNew === false && this.state.showSearchResults?
                                this.state.results.filter(e => this.state.searchInput.toLowerCase().indexOf(e.contactName.toLowerCase()) > -1).map(show =>
                                <div className="card-title card-header search" onClick={() => this.searchHandler(show)}>{show.contactName}</div>
                                ):null}

                            {this.state.showRegisterNew?
                                <div className="card card-body">
                                    {this.props.registerComponent}
                                </div>:null}

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    callBackSearchResult = () => {
        let currentState = this.state;

        artistService.getArtistForOrganizer((allArtistByOrganizer) => {
            currentState.results = allArtistByOrganizer;
            console.log(allArtistByOrganizer);
            this.setState(currentState);
            console.log(this.state);
        },CookieStore.currentUserID);
    }

    searchHandler(input){
        let currentState = this.state;
        currentState.showSearchResults = false;
        currentState.showRegisterNew = false;
        currentState.showPerformerCard = true;
        this.setState(currentState);

        this.props.searchHandler(input);
    }

    registerNew(){
        let currentState = this.state;
        currentState.showRegisterNew = !currentState.showRegisterNew;
        currentState.showSearchResults = false;

        this.setState(currentState);

    }

    handleSearchInput(event){
        let currentState = this.state;
        currentState.showSearchResults = true;
        currentState.showRegisterNew = false;
        currentState.searchInput = event.target.value;
        this.setState(currentState);



    }
}

