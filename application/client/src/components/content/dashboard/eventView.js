import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";

export class EventView extends React.Component {

    state = {
        events: [this.props.events]
    };

    static getDerivedStateFromProps(props, state) {
        if(props.events !== state.events) {
            return {
                events: props.events
            };
        }
        return null;
    }

    render() {

        console.log(this.state.events);

        return(
            <Table striped>
                <tbody>
                {this.state.events.map(event => (
                    <EventCard event={event}/>
                ))}
                </tbody>
            </Table>
        )
    }
}