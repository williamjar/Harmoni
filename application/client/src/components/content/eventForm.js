import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {AddPerformer, Performers} from "./performers";
import {Crew} from "./crew";
import {GeneralInfo, InfoView} from "./generalInfo";
import {DocumentationTab} from "../documentationTab";



export class EventForm extends Component{

    state = {
        activeTab: 0,
        edit: false,
    };

    // Handles when the user clicks "neste"
    editClicked = () => {
        this.setState({edit: true})
    };

    render(){
        return(
            <Tabs defaultActiveKey="0" id="tabs">
                <Tab eventKey="0" title="Generelt" >
                    <TabContent editClicked={this.editClicked} editable={this.state.edit}>
                        <GeneralInfo editable={this.state.edit}/>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent editClicked={this.editClicked}>
                        <Performers editable={this.state.edit}/>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent editClicked={this.editClicked}>
                        <Crew editable={this.state.edit}/>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent editClicked={this.editClicked}>
                        <DocumentationTab editable={this.state.edit}/>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}