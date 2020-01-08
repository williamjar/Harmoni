import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import {Accordion, Button} from "react-bootstrap";
import {FaAngleDown} from "react-icons/fa";
import {EventView} from "./eventView";

// Component displaying all of the users events
export class Dashboard extends React.Component {

    render() {

        return(
            <div>
                <h3>Arrangementer</h3>
                <Accordion defaultActiveKey="0">
                    <div className="row">
                        <p>Planlagte arrangement</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </div>
                    <Accordion.Collapse eventKey="0">
                        <div className='row'>
                            <EventView/>
                        </div>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion defaultActiveKey="0">
                    <div className="row">
                        <p>Under planlegging</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </div>
                    <Accordion.Collapse eventKey="0">
                        <div className='row'>
                            <EventView/>
                        </div>
                    </Accordion.Collapse>
                </Accordion>

                <Accordion defaultActiveKey="0">
                    <div className="row">
                        <p>Arkiverte</p>
                        <Accordion.Toggle as={FaAngleDown} variant="link" eventKey="0"/>
                    </div>
                    <Accordion.Collapse eventKey="0">
                        <div className='row'>
                            <EventView/>
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </div>



        )
    }
}