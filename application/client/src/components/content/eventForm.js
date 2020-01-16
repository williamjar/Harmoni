import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {PerformerPanel, PerformersView} from "./performers";
import {GeneralInfo} from "./generalInfo";
import {CrewTab} from "./crew";
import {DocumentationTab} from "../documentationTab";
import {DocList} from "../docView";
import {EventStore} from "../../store/eventStore";
import {createHashHistory} from "history";

const history = createHashHistory();

// Parent component for editing and viewing all info about an event, divides information into tabs.
export class EventForm extends Component{

    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            edit: false,
        };

    }

    //TODO: Implement tab shifting with button click

    // Handles when the user wants to edit the event
    editClicked = () => {
        this.setState({edit: true})
    };

    // Handles when the user saves the event
    saveClicked = () => {
        this.setState({edit: false});
        EventStore.postCurrentEvent().then(history.push("/"));
    };

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
                            {this.state.edit ? <PerformerPanel editable={this.state.edit}/> : <PerformersView/>}
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