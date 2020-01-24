import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";
import {Card, CardGroup, CardStock, ListGroup} from "react-bootstrap";

// Component for displaying a group of events(EventCard's) as a table
export class EventView extends React.Component {

    state = {
        events: [this.props.events]
    };

    // Updates the state if the received props from parent is changed
    static getDerivedStateFromProps(props, state) {
        if(props.events !== state.events) {
            return {
                events: props.events
            };
        }
        return null;
    }

    render() {
        return(
            <Table>
                {this.state.events.map(event => (
                    <EventCard key={event.eventID} event={event}/>
                ))}
            </Table>
        )
    }
}


