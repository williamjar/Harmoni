import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import {InputGroup} from "react-bootstrap";
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
                <Form>
                <Form.Label column={6}>
                    <h1>Navn på arrangement:</h1>
                </Form.Label>

                    <div className = "padding-top-20">
                        <Form.Control type="text" placeholder="" onChange={this.inputHandler}/>
                    </div>

                    {this.state.emptyMessage?<div className="text-red">{this.emptyMessage}</div>:null}



                    <div className = "padding-top-20">
                        <Button variant="success" type="submit" onClick={this.create}>
                            Submit
                        </Button>
                    </div>
                </Form>
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
            eventStore.createEvent(() => {history.push('/arrangementEdit')}, this.state.inputName,CookieStore.currentUserID);


        }
    }
}