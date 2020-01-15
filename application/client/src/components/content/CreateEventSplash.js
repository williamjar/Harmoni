import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import {InputGroup, FormControl} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import {CookieStore} from "../../store/cookieStore";
import {eventStore} from "../../store/eventStore";
let history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

export class CreateEventSplash extends Component{
    emptyMessage = "Navn kan ikke være tomt";
    error = false;

    constructor(props){
        super(props);

        this.state = {
            inputName : "",
            emptyMessage: false,
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.create = this.create.bind(this);

    }

    render() {
        return (
            <div className="splashCreateEvent w-75 center">

                    <div className = "padding-top-20">

                        <InputGroup className="mb-3 " size="lg">
                            <FormControl
                                onChange={this.inputHandler}
                                placeholder="Navn på arrangementet"
                                aria-label="Navn på arrangementet"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button onClick={this.create} variant="success">Opprett</Button>
                            </InputGroup.Append>
                        </InputGroup>

                    </div>

                    {this.state.emptyMessage?<div className="text-red">{this.emptyMessage}</div>:null}


            </div>
        );
    }

    inputHandler(event){
        this.setState({inputName: event.target.value});
    }

    create(){
        let eventName = this.state.inputName;
        if(this.state.inputName.trim() === ""){
            let state = this.state;
            state.emptyMessage = true;
            this.setState(state);
        } else{
            eventStore.createEvent(() => {
                history.push("/arrangementEdit");
                console.log(history.location);
            }, this.state.inputName, CookieStore.currentUserID);
        }
    }
}
