import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import {InputGroup, FormControl, Spinner, FormLabel} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import {CookieStore} from "../../store/cookieStore";
import {EventStore} from "../../store/eventStore";
let history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class CreateEventSplash extends Component{
    emptyMessage = "Navn kan ikke være tomt";
    error = false;

    constructor(props){
        super(props);

        this.state = {
            inputName : "",
            emptyMessage: false,
            isLoading: false,
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.create = this.create.bind(this);

    }

    render() {
        if(this.state.isLoading){
            return(
                <div className="splashCreateEvent w-75 center">
                <Spinner animation="border" />
                </div>
            )
        } else {
        return (
            <div className=" w-75 center">

                    <div className = "padding-top-bottom-100">

                    <Form onSubmit={this.create}>
                        <div className="padding-bottom-10"> Opprett  arrangement</div>
                        <InputGroup className="mb-3 " size="sm">
                            <FormControl
                                onChange={this.inputHandler}
                                placeholder="Skriv inn navn på arrangementet"
                                aria-label="Skriv inn navn på arrangementet"
                                aria-describedby="basic-addon2"
                            />

                            <InputGroup.Append>
                                <Button type="submit" variant="success">Opprett</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    </div>

                    {this.state.emptyMessage?<div className="text-red">{this.emptyMessage}</div>:null}


            </div>
        );}
    }

    inputHandler(event){
        this.setState({inputName: event.target.value});
    }

    create(){
        this.setState({isLoading: true});
        let eventName = this.state.inputName;
        if(this.state.inputName.trim() === ""){
            let state = this.state;
            state.emptyMessage = true;
            this.setState(state);
        } else{
            EventStore.createEvent(() => {
                history.push("/arrangementEdit");
                this.setState({isLoading: false});
            }, this.state.inputName, CookieStore.currentUserID);
        }
    }
}
