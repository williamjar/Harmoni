import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

const event = {
    date: "Jan 01",
    location: "Lorde, Trondheim Spektrum"
};

export class EventCard extends React.Component {

    render() {

        return(
            <tr align>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td><Button>Vis arrangement</Button></td>
            </tr>
        )
    }
}