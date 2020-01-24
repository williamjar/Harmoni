import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Table from "react-bootstrap/Table";
import {EventCard} from "./eventCard";
import {FaAngleDown} from "react-icons/all";

/**
 * @class EventView
 * classdesc Component for displaying a table of events.
 */
export class EventView extends React.Component {

    state = {
        events: [this.props.events],
        limitation: 5,
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

    showMore = () => {
        this.setState({limitation: this.state.limitation + 5})
    };

    render() {
        return(
            <Table>
                {this.state.events.length <= this.state.limitation ? this.state.events.map(event => (
                    <EventCard key={event.eventID} event={event}/>
                )) :
                    <div>
                        {this.state.events.slice(0, this.state.limitation).map(event => (
                            <EventCard key={event.eventID} event={event}/>
                            ))}
                            <div className="text-center showMore pointer" onClick={this.showMore}>
                                Vis flere
                                <FaAngleDown size={20}/>
                            </div>
                    </div>}
            </Table>
        )
    }
}


