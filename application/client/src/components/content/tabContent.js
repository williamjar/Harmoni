import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";
import {Alert} from '../alerts.js';
import {MailService} from "../../store/mailService";

const history = createHashHistory();

// Container-component for the different tabs in EventForm
// Renders differently when editing events
export class TabContent extends Component {

    state = {
        editable: [this.props.editable],
        activeTab: [this.props.tab],
        status: EventStore.currentEvent.status,
    };

    componentWillReceiveProps({someProp}) {
        this.setState({...this.state,someProp})
    }

    render() {
        console.log("Status: " + this.state.status);
        return (
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col>
                        <div>
                            <Button className="float-right mr-1" onClick={() => {
                                console.log("next");
                                this.props.btnClick();
                            }}>Neste</Button>


                            <Button hidden={!(this.state.status === 1)} variant="danger" className="mr-2" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil kansellere dette arrangementet?')) this.cancelEvent();
                            }}>Kanseller</Button>

                            <Button hidden={this.state.status === 1} variant="danger" className="mr-2" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil slette dette arrangementet? Dette kan ikke reverseres!')) this.deleteEvent()
                            }}>Slett arrangement</Button>

                            <Button hidden={!(this.state.status === 0)} className="mr-2" variant="success" onClick={() => {
                                if (window.confirm('Er du sikker på at du vil publisere dette arrangementet?')) this.publishEvent()
                            }}>Publiser</Button>

                            <Button hidden={!(this.state.status === 3)} className="mr-2" variant="success" onClick={() => {
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

        if (props.tab !== state.activeTab) {
            return {
                activeTab : props.tab
            };
        }
        return null;
    }

    // TODO Create a custom confirm window for these.
    deleteEvent = () => {
        EventStore.deleteCurrentEvent().then(console.log('Event deleted!'));
        history.push("/");
    };

    publishEvent = () => {
        EventStore.publishCurrentEvent().then(console.log('Event published!'));
        this.setState({status : 1});
        Alert.success("Arrangementet har blitt publisert")
    };

    cancelEvent = () => {
        EventStore.cancelCurrentEvent().then(console.log('Event cancelled!'));
        this.setState({status : 3});

        if (EventStore.currentEvent.artists.length > 0 || EventStore.currentEvent.crewMembers.length > 0){
            MailService.sendCancelNotice("Avlyst arrangement",
                "Arrangementet " + EventStore.currentEvent.eventName + " har blitt avlyst.",
                EventStore.currentEvent.artists, EventStore.currentEvent.crewMembers, null, () => {
                    Alert.info("Mail har blitt sendt til alle involverte om avlysningen");
            });
        }
        Alert.danger("Arrangementet har blitt kansellert")
    };

    planEvent = () => {
        EventStore.planCurrentEvent().then(console.log('Event sent to planning!'));
        this.setState({status : 0});
        Alert.success("Arrangementet har blitt flyttet til under planlegging")
    };
}