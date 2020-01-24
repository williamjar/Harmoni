import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row, Card} from "react-bootstrap";
import { createHashHistory } from 'history';
import {EventStore} from "../../../store/eventStore";
import {RiderStore} from "../../../store/riderStore";
import {Rider} from "../performers";

const history = createHashHistory();

// Component displaying a single event as a row in the parent table
export class EventCard extends React.Component {

    state = {
        date: null,
    };

    // Sends the user to the event-screen when clicking "vis"
    viewEvent = () => {
        if (!(EventStore.eventCategories[0])) {
            EventStore.getEventCategories(() => {
            });
        }
        EventStore.setCurrentEvent(this.props.event);
        RiderStore.storeAllRidersForEvent(() => {
            history.push("/arrangementEdit/" + this.props.event.eventID);
        }, EventStore.currentEvent.eventID);
    };

    render() {
        return(

            <Card className={"m-2 p-2 shadow-sm pointer main-color-hover"} onClick={this.viewEvent}>
                <Card.Body>
                    <Row>
                     <Col>{this.formatDate(this.props.event.startDate)}</Col>
                     <Col align="right">{this.props.event.eventName} {this.props.event.town !== "" && this.props.event.town !== null ? " - " + this.props.event.town : null}</Col>
                </Row>
                </Card.Body>
            </Card>

        )
    }

    /*<tr align='center'>
<td align="left">{this.formatDate(this.props.event.startDate)}</td>
<td>{this.props.event.eventName} {this.props.event.town !== "" && this.props.event.town !== null ? " - " + this.props.event.town : null}</td>
<td align="right"><Button variant="outline-primary" onClick={this.viewEvent}>Vis </Button></td>
</tr>*/

    componentDidMount() {
        let date = this.formatDate(this.props.event.startDate);
        this.setState({date: date});
    }

    // Converts the date of an event to a more readable format
    formatDate = (d) => {
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let date = new Date(d);
        return date.toLocaleDateString("nb-NO", options).toLocaleLowerCase();
    }
}