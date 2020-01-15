import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {PerformersView} from "./performers";
import {GeneralInfo} from "./generalInfo";
import {PerformerCard, PerformersTab} from "./performers";
import {CrewTab, CrewView} from "./crew";
import {DocumentationTab} from "../documentationTab";
import {DocList} from "../docView";
import {riderStore} from "../../store/riderStore";
import {eventStore} from "../../store/eventStore";



export class EventForm extends Component{

    state = {
        activeTab: 0,
        edit: false,
    };

    // Handles when the user clicks "neste"
    editClicked = () => {
        this.setState({edit: true})
    };

    saveClicked = () => {
        this.setState({edit: false})
    };

    componentDidMount() {
    }

    render(){
        return(
            <Tabs defaultActiveKey="0" id="tabs">
                <Tab eventKey="0" title="Generelt" >
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                            <GeneralInfo editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                            {this.state.edit ? <PerformersTab editable={this.state.edit}/> : <PerformersView/>}
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                            <CrewTab editable={this.state.edit}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editalbe={this.state.edit}>
                        <div className="padding-bottom-20">
                        <DocumentationTab editable={this.state.edit}/>
                        <DocList/>
                        </div>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}