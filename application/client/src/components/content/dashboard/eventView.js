import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";

export class EventView extends React.Component {

    render() {

        return(
            <Table striped>
                <tbody>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                </tbody>
            </Table>
        )
    }
}