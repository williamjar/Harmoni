import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";

export class EventCard extends React.Component {

    // Handles when the user
    viewEvent = () => {

    };

    render() {

        return(
            <tr align='center'>
                <td>{this.props.date}</td>
                <td>{}</td>
                <td align="right"><Button onClick={this.viewEvent}>Vis arrangement</Button></td>
            </tr>
        )
    }
}