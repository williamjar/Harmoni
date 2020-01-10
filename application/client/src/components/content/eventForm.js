import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {AddPerformer, Performers} from "./performers";
import {Crew} from "./crew";
import {GeneralInfo} from "./generalInfo";
import {DocumentationTab} from "../documentationTab";



export class EventForm extends Component{

    state = {
      activeTab: "0",
    };

    // Handles when the user clicks "neste"
    nextClicked = () => {

    };

    render(){
        return(
            <Tabs defaultActiveKey="0" id="tabs">
                <Tab eventKey="0" title="Generelt" >
                    <TabContent onClick={this.nextClicked}>
                        <GeneralInfo/>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent onClick={this.nextClicked}>
                        <Performers/>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent onClick={this.nextClicked}>
                        <Crew />
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent onClick={this.nextClicked}>
                        <DocumentationTab/>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}