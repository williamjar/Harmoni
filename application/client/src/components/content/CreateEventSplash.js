import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import {InputGroup, FormControl, Spinner} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { createHashHistory } from 'history';
import {CookieStore} from "../../store/cookieStore";
import {EventStore} from "../../store/eventStore";
import {Alert} from "../alerts";

let history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

/**
 * @class CreateEventSplash
 * @classdesc Component for creating a new event.
 */
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
                        <div className="padding-bottom-10 center">Opprett nytt arrangement</div>
                        <InputGroup className="mb-3 " size="sm">
                            <FormControl
                                onChange={this.inputHandler}
                                placeholder="Tittel på arrangementet"
                                aria-label="Tittel på arrangementet"
                                aria-describedby="basic-addon2"

                            />

                            <InputGroup.Append>
                                <Button alt="Denne knappen vil opprette et nytt arrangement. Du vil få muligheten til å oppdatere navnet senere." type="submit" variant="success">Opprett</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    </div>

            </div>
        );}
    }

    inputHandler(event){
        this.setState({inputName: event.target.value});
    }

    create(){
        this.setState({isLoading: true});
        if(this.state.inputName.trim() === ""){
            let state = this.state;
            state.emptyMessage = true;
            Alert.danger("Tittel kan ikke være tom");
            this.setState(state);
        } else{
            if (!(EventStore.eventCategories[0])) {
                EventStore.getEventCategories(() => {
                });
            }
            EventStore.createEvent(() => {
                history.push('/arrangementEdit/');
                this.setState({isLoading: false});
            }, this.state.inputName, CookieStore.currentUserID);
        }
    }
}
