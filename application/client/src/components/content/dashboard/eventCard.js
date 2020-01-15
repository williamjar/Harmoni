import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import { createHashHistory } from 'history';
import {eventStore} from "../../../store/eventStore";

const history = createHashHistory();

// Component displaying a single event as a table row
export class EventCard extends React.Component {

    state = {
        date: null,
    };

    // Handles when the user
    viewEvent = () => {
        eventStore.currentEvent = this.props.event;
        history.push("/arrangementEdit/" + this.props.event.eventID);
    };

    render() {

        return(
            <tr align='center'>
                <td align="left">{this.state.date}</td>
                <td>{this.props.event.eventName} - {this.props.event.town}</td>
                <td align="right"><Button variant="outline-secondary" onClick={this.viewEvent}>Vis </Button></td>
            </tr>
        )
    }

    componentDidMount() {
        let datestring = this.props.event.startDate;
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        let date = new Date(datestring);
        let startDate = date.toLocaleDateString("nb-NO", options).toLocaleUpperCase();
        this.setState({date: startDate});
    }
}