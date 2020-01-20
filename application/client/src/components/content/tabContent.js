import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";
import {Alert} from '../alerts.js';

const history = createHashHistory();

// Container-component for the different tabs in EventForm
// Renders differently when editing events
export class TabContent extends Component {

    state = {
        editable: [this.props.editable],
        status: EventStore.currentEvent.status,
    };

    render() {
        console.log("Status: " + this.state.status);
        return (
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col xs={6} md={3}>
                        <div>
                            <Button className="mr-1" onClick={this.props.onClick}>Neste</Button>

                            <Button hidden={!(this.state.status === 1)} variant="danger" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil kansellere dette arrangementet?')) this.cancelEvent();
                            }}>Kanseller</Button>

                            <Button hidden={this.state.status === 1} variant="danger" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil slette dette arrangementet? Dette kan ikke reverseres!')) this.deleteEvent()
                            }}>Slett</Button>

                            <Button hidden={!(this.state.status === 0)} className="mr-1" variant="success" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil publisere dette arrangementet?')) this.publishEvent()
                            }}>Publiser</Button>

                            <Button hidden={!(this.state.status === 3)} className="mr-1" variant="success" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil gjenopta dette arrangementet?')) this.planEvent();
                            }}>Gjenoppta</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    // Updates the state when the received props from parent changes
    static getDerivedStateFromProps(props, state) {

        if (props.editable !== state.editable) {
            return {
                editable: props.editable
            };
        }
        return null;
    }

    // TODO Create a custom confirm window for these.
    deleteEvent = () => {
        EventStore.deleteCurrentEvent().then(console.log('Event deleted!'));
        history.push("/");
    };

    // Nothing seems to happen

    publishEvent = () => {
        EventStore.publishCurrentEvent().then(console.log('Event published!'));
        this.setState({status : 1})
        Alert.success("Arrangementet har blitt publisert")
    };

    archiveEvent = () => {
        EventStore.archiveCurrentEvent().then(console.log('Event archived!'));
        history.push("/");
    };

    cancelEvent = () => {
        EventStore.cancelCurrentEvent().then(console.log('Event cancelled!'));
        this.setState({status : 3})
        Alert.danger("Arrangementet har blitt kansellert")
    };

    planEvent = () => {
        EventStore.planCurrentEvent().then(console.log('Event sent to planning!'));
        this.setState({status : 0})
        Alert.success("Arrangementet har blitt flyttet til under planlegging")
    };
}