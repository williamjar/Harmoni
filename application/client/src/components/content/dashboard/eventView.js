import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";

export class EventView extends React.Component {

    render() {

        const events = this.props.events;

        console.log(events);

        return(
            <Table striped>
                <tbody>

                </tbody>
            </Table>
        )
    }
}