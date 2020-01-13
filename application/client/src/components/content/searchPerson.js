import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import {FaSearch} from "react-icons/all";
import Form from "react-bootstrap/Form";
import {Row, Col} from 'react-bootstrap';


export class SearchPeople extends Component{

    constructor(props){
        super(props);

        this.state = {
            searchInput : "",
            results : [{input : "Lorde"}, {input : "lor"}],
            showRegisterNew : false,
            showSearchResults: true,
            showPerformerCard: false,
        };

        this.handleSearchInput = this.handleSearchInput.bind(this);
        this.registerNew = this.registerNew.bind(this);
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
                            <InputGroup.Append>
                                <div className="searchButtons">
                                <FaSearch/>
                                <Button variant="outline-secondary rounded" onClick={this.registerNew}>Registrer ny</Button>
                                </div>
                            </InputGroup.Append>
                        </InputGroup>

                        <div className="card-text margin-top-5 ma">
                            {this.state.showRegisterNew === false && this.state.showSearchResults?
                                this.state.results.filter(e => this.state.searchInput.toLowerCase().indexOf(e.input.toLowerCase()) >= 0).map(show =>
                                <div className="card-title card-header search" onClick={() => this.searchHandler(show.input)}>{show.input}</div>
                            ):null}

                            {this.state.showRegisterNew?
                                <div className="card card-body">
                                    <RegisterPerformer />
                                </div>:null}

                        </div>
                    </div>
                </div>
            </div>
        )
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

export class RegisterPerformer extends Component{
    render() {
        return(
            <div>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Navn</Form.Label>
                            <Form.Control type="name" placeholder="" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Telefon</Form.Label>
                            <Form.Control type="phone" placeholder="" />
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="formGridAddress1">
                        <Form.Label>Epost</Form.Label>
                        <Form.Control type="email" placeholder="" />
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridState">
                            <Form.Label>Sjanger</Form.Label>
                            <Form.Control as="select">
                                <option>Country</option>
                                <option>Blues</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" type="cancel" className="margin-left-5">
                        Cancel
                    </Button>

                </Form>
            </div>
        )
    }
}