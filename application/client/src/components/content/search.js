import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

/**
 * @class Search
 * @classdesc Search component is a universal search bar component that displays matching search results
 */
export class Search extends Component{
    /*
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
            <div className="search" onBlur={this.toggleShowResults} >
                <InputGroup>
                    <FormControl
                        placeholder="Søk"
                        aria-label="Søk"
                        aria-describedby="basic-addon2"
                        onChange={this.handleSearchInput}
                        className="rounded-pill"
                    />
                </InputGroup>

                <div className="results" id="style-5">
                    {(this.state.showSearchResults && this.props.results[0] !== undefined && this.props.results[0].contactName !==  undefined &&  this.state.results.length !== 0)?
                        this.state.results.filter(e => e.contactName.toLowerCase().trim().indexOf(this.state.searchInput.toLowerCase()) > -1 && this.state.searchInput.trim() !== "").map((show, index) =>
                        <div className="card-title card-header search-result-item" tabIndex={index} onClick={() => this.searchHandler(show)}>
                            <div className="row no-gutters">
                                <div className="col-12">
                                    {show.contactName}
                                </div>
                            </div>

                        </div>
                        ):null}

                    {(this.state.showSearchResults && this.props.results[0] !== undefined && this.props.results[0].eventName !== undefined) ?
                        this.state.results.filter(e => e.eventName.toLowerCase().trim().indexOf(this.state.searchInput.toLowerCase()) > -1 && this.state.searchInput.trim() !== "").map((show, index) =>
                            <div className="card-title card-header search-result-item" tabIndex={index} onClick={() => this.searchHandler(show)}>
                                <div className="row no-gutters">
                                    <div className="col-lg-5 col-sm-4">
                                    {show.eventName}
                                    </div>
                                    <div className="col-lg-5 text-right col-sm-5">
                                        {show.startDate.substr(0,10)}
                                    </div>
                                    <div className="col-lg-2 text-right col-sm-3">
                                        {(show.town === null || show.town.trim() === "" ) ? <i>Ingen adresse</i>:show.town}
                                    </div>
                                </div>
                            </div>
                        ):null}

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

    toggleShowResults = () => {
        setTimeout(() => {this.setState({showSearchResults: !this.state.showSearchResults})}, 150);
    };

    searchHandler(input){
        setTimeout(() => {this.setState({showSearchResults: false})}, 180);
        this.props.searchHandler(input); // Sends object of selection to parent method.
    }

    handleSearchInput(event){
        let currentState = this.state;
        currentState.showSearchResults = true; //Show matching search results
        currentState.searchInput = event.target.value;
        this.setState(currentState);
    }
}

