import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";


export class Search extends Component{
    /* Search component is a universal search bar component that displays matching search results
    Takes in props:
    this.props.results : array that should be searched against
    this.props.searchHandler : a parent method that receives an object of the person or event that was selected.

    This searchbar checks against .contactName
     */

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
        currentState.results = this.props.results; // Load results on mount
        this.setState(currentState);
    }


    static getDerivedStateFromProps(props, state) {
        /* Updates props according to parent state change*/
        if(props.results !== state.results) {
            return {
                results: props.results
            };
        }
        return null;
    }


    searchHandler(input){
        let currentState = this.state;
        currentState.showSearchResults = false; //Hide search results after selection
        this.setState(currentState);
        this.props.searchHandler(input); // Sends object of selection to parent method.
    }

    handleSearchInput(event){
        let currentState = this.state;
        currentState.showSearchResults = true; //Show matching search results
        currentState.searchInput = event.target.value;
        this.setState(currentState);
    }
}

