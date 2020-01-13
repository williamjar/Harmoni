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
        edit: true,
    };

    // Handles when the user clicks "neste"
    editClicked = () => {
        if(this.state.edit) {
            this.setState({edit: false});
        } else {
            this.setState({edit: true})
        }
    };

    render(){
        return(
            <Tabs defaultActiveKey="0" id="tabs">
                <Tab eventKey="0" title="Generelt" >
                    <TabContent editClicked={this.editClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                        <GeneralInfo editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent editClicked={this.editClicked}>
                        <div className="padding-bottom-20">
                        <Performers editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent editClicked={this.editClicked}>
                        <div className="padding-bottom-20">
                        <Crew editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent editClicked={this.editClicked}>
                        <div className="padding-bottom-20">
                        <DocumentationTab editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}