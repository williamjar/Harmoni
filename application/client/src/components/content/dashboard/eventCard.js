import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

const event = {
    date: "Jan 01",
    location: "Lorde, Trondheim Spektrum"
};

export class EventCard extends React.Component {

    // Handles when the user
    viewEvent = () => {

    };

    render() {

        return(
            <tr align='center'>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td align="right"><Button onClick={this.viewEvent}>Vis arrangement</Button></td>
            </tr>
        )
    }
}