import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "react-bootstrap";
import { createHashHistory } from 'history';

const history = createHashHistory();

// Component displaying a single event as a table row
export class EventCard extends React.Component {

    // Handles when the user
    viewEvent = () => {
        history.push("/arrangementEdit");
    };

    render() {

        return(
            <tr align='center'>
                <td>{this.props.event.startDate}</td>
                <td>{}</td>
                <td align="right"><Button onClick={this.viewEvent}>Vis arrangement</Button></td>
            </tr>
        )
    }
}