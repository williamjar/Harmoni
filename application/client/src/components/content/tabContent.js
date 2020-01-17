import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";

const history = createHashHistory();

// Container-component for the different tabs in EventForm
// Renders differently when editing events
export class TabContent extends Component {

    state = {
        editable: [this.props.editable],
    };

    render() {
        return (
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col xs={6} md={3}>
                        {
                                <div>
                                    <Button className="mr-1" onClick={this.props.onClick}>Neste</Button>

                                    <Button variant="danger" onClick={() => {
                                        if (window.confirm('Er du sikker på at du vil slette dette arrangementet? Dette kan ikke reverseres!')) this.deleteEvent()
                                    }}>Slett</Button>

                                    <Button className="mr-1" variant="success" onClick={() => {
                                        if (window.confirm('Er du sikker på at du vil publisere dette arrangementet?')) this.publishEvent()
                                    }}>Publiser</Button>
                                </div>
                        }
                    </Col>
                </Row>
            </div>
        )
    }

    // Updates the state when the received props from parent changes
    static getDerivedStateFromProps(props, state) {

        if(props.editable !== state.editable) {
            return {
                editable: props.editable
            };
        }
        return null;
    }

    deleteEvent = () => {
        // TODO Create a custom confirm window
        EventStore.deleteCurrentEvent().then(console.log('Event deleted!'));
        history.push("/");
    };

    // Nothing seems to happen

    publishEvent = () => {
        // TODO Create a custom confirm window
        EventStore.publishCurrentEvent().then(console.log('Event published!'));
        history.push("/");
    };

    archiveEvent = () => {
        // TODO Create a custom confirm window
        EventStore.archiveCurrentEvent().then(console.log('Event archived!'));
        history.push("/");
    };

    cancelEvent = () => {
        // TODO Create a custom confirm window
        EventStore.cancelCurrentEvent().then(console.log('Event cancelled!'));
        history.push("/");
    };

}



//geir