import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";

export class EventView extends React.Component {

    render() {

        const event = this.props.event1;


        console.log(event);

        return(
            <Table striped>
                <tbody>
                    <EventCard date={event.startDate}/>
                    <EventCard event/>
                    <EventCard event/>
                    <EventCard event/>
                </tbody>
            </Table>
        )
    }
}