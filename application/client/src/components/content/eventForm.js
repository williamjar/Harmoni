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
                        <div className="padding-bottom-20">
                        <GeneralInfo/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent onClick={this.nextClicked}>
                        <div className="padding-bottom-20">
                        <Performers/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent onClick={this.nextClicked}>
                        <div className="padding-bottom-20">
                        <Crew />
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent onClick={this.nextClicked}>
                        <div className="padding-bottom-20">
                        <DocumentationTab/>
                        </div>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}