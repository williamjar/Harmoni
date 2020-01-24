import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs,} from "react-bootstrap";
import {TabContent} from "./tabContent";
import {PerformerPanel} from "./performers";
import {GeneralInfo} from "./generalInfo";
import {CrewPanel} from "./crew";
import {DocumentationTab} from "../documentationTab";
import {EventStore} from "../../store/eventStore";
import {OrganizerStore} from "../../store/organizerStore";
import {Event} from "../../classes/event";
import {Alert} from "../alerts";

/**
 * @class EventForm
 * @classdesc Parent component for editing and viewing all info about an event, divides information into tabs.
 */
export class EventForm extends Component {

    constructor(props) {
        super(props);

        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.state = {
            activeTab: 0,
            editMode: this.props.edit,
        };
    }

    handleSelect = tab => {
        this.setState({activeTab: tab});
    };

    handleButtonClick = () => {
        let tab = this.state.activeTab;
        if (tab < 3) {
            tab++;
        }
        this.setState({activeTab: tab});
    };

    // Handles when the user wants to edit the event
    editClicked = () => {
        this.setState({edit: true})
    };

    // Handles when the user saves the event
    saveClicked = () => {
        if (this.validateForm()) {
            this.setState({edit: false});
            EventStore.editCurrentEvent().then(() => Alert.info("Lagret!"));
        } else {
            Alert.danger("Startdato må være før sluttdato.");
        }
    };

    render() {
        // On page reload uses sessionstorage to set set the currentEvent variable.
        if (!(EventStore.currentEvent)) {
            if (sessionStorage.getItem("currentEvent")) {
                let sess = JSON.parse(sessionStorage.getItem("currentEvent"));
                EventStore.currentEvent = new Event(sess.eventID, sess.eventName, sess.startDate,
                    sess.endDate, sess.startTime, sess.endTime, sess.address, sess.town,
                    sess.zipCode, sess.status, sess.description, sess.publishDate,
                    sess.publishTime, sess.organizer, sess.eventType, sess.picture);
                OrganizerStore.currentOrganizer = sess.organizer;
            }
        }
        return (
            <Tabs activeKey={this.state.activeTab} id="tabs" onSelect={this.handleSelect}>
                <Tab eventKey="0" title="Generelt" value={0}>
                    <TabContent tab={this.state.activeTab} btnClick={this.handleButtonClick}>
                        <div className="padding-bottom-20">
                            <GeneralInfo editMode={this.state.editMode}/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey={1} title="Artister" >
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked}
                                editable={this.state.edit} tab={this.state.activeTab} btnClick={this.handleButtonClick}>
                        <div className="padding-bottom-20">
                            <PerformerPanel/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="2" title="Personell">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked}
                                editable={this.state.edit} tab={this.state.activeTab} btnClick={this.handleButtonClick}>
                        <div className="padding-bottom-20">
                            <CrewPanel/>
                        </div>
                    </TabContent>
                </Tab>
                <Tab eventKey="3" title="Dokumenter">
                    <TabContent editClicked={this.editClicked} saveClicked={this.saveClicked}
                                editable={this.state.edit} tab={this.state.activeTab} btnClick={this.handleButtonClick}>
                        <div className="padding-bottom-20">
                            <DocumentationTab editable={true}/>
                        </div>
                    </TabContent>
                </Tab>
            </Tabs>
        );
    }
}
