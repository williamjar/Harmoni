import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row, Card} from "react-bootstrap";
import { createHashHistory } from 'history';
import {EventStore} from "../../../store/eventStore";
import {RiderStore} from "../../../store/riderStore";

const history = createHashHistory();

/**
 * @class EventCard
 * classdesc Component for displaying an singular event on the dashboard.
 */
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
                        <Col className="col-lg-8 col-sm-4">{this.props.event.eventName}</Col>
                        <Col className="col-lg-2 text-left col-sm-5">{this.formatDate(this.props.event.startDate)}</Col>
                        <Col className="col-lg-2 text-right col-sm-3">{this.props.event.town !== "" && this.props.event.town !== null ? this.props.event.town : <div className="font-italic">Ingen adresse</div>}</Col>
                </Row>
                </Card.Body>
            </Card>

        )
    }

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