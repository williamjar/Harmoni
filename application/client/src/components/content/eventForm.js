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
import {RiderStore} from "../../store/riderStore";
import {CookieStore} from "../../store/cookieStore";

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


    // Handles when the user wants to edit the event
    editClicked = () => {
        this.setState({edit: true})
    };

    // Handles when the user saves the event
    saveClicked = () => {
        if(this.validateForm()){
            this.setState({edit: false});
            EventStore.editCurrentEvent().then(console.log("Lagret"));
        } else{
            console.log("start date can not be after end date");
        }
    };

    render(){
        return(
            <Tabs defaultActiveKey="0" id="tabs">
                <Tab eventKey="0" title="Generelt" >
                    <TabContent>
                        <div className="padding-bottom-20">
                            <GeneralInfo/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="1" title="Artister">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                            <PerformerPanel/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editable={this.state.edit}>
                        <div className="padding-bottom-20">
                            <CrewTab editable={true}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumentasjon">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked} editalbe={this.state.edit}>
                        <div className="padding-bottom-20">
                        <DocumentationTab editable={true}/>
                        <DocList/>
                        </div>
                    </TabContent>
                </Tab>
            </Tabs>
        )
    }
}
