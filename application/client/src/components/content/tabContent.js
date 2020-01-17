import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";

const history = createHashHistory();

// Container-component for the different tabs in EventForm
// Renders differently when editing events
export class TabContent extends Component {

    state = {
        editable: [this.props.editable],
    };

    render() {
        return (
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col xs={8}>
                        {this.state.editable ?
                            <Button className="mr-1" variant="secondary" onClick={this.props.saveClicked}>Lagre og
                                lukk</Button> :
                            <Button onClick={this.props.editClicked}>Rediger</Button>}
                    </Col>
                    <Col xs={6} md={3}>
                        {
                            this.state.editable ?
                                <div>
                                    <Button className="mr-1" onClick={this.props.onClick}>Neste</Button>

                                    <Button variant="danger" onClick={this.deleteClicked}>Slett arrangement</Button>
                                    <Button className="mr-1" disabled variant="success">Publiser</Button>
                                </div> : null
                        }
                    </Col>
                </Row>
            </div>
        )
    }

    // Updates the state when the received props from parent changes
    static getDerivedStateFromProps(props, state) {

        if (props.editable !== state.editable) {
            return {
                editable: props.editable
            };
        }
        return null;
    }

    deleteClicked = () => {
        EventStore.deleteCurrentEvent().then(console.log('Event deleted!'));
        history.push("/");
    };
}