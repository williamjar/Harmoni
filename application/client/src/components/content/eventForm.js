import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {AddPerformer, Performers} from "./performers";



export class EventForm extends Component{
    render(){
        return(
            <Tabs defaultActiveKey="General">
                <Tab eventKey="General" title="Generelt">
                    <TabContent>
                    </TabContent>
                </Tab>
                <Tab eventKey="profile" title="Artister">
                    <TabContent>
                        <AddPerformer/>
                    </TabContent>
                </Tab>
                <Tab eventKey="personel" title="Personell">
                    <TabContent>

                    </TabContent>
                </Tab>
                <Tab eventKey="documentation" title="Dokumentasjon">
                    <TabContent>

                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}