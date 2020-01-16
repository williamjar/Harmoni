import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FaFolder, FaFolderOpen} from "react-icons/all";
import { createHashHistory } from 'history';
import {DocumentService as documentService} from "../store/documentService";
import {DocumentCategory} from "../classes/documentCategory";
import {OrganizerStore as organizerStore} from "../store/organizerStore";
import {EventStore as eventStore} from "../store/eventStore";


const history = createHashHistory();



export class FolderItem extends Component{
    constructor(props){
        super(props);
        this.state= {
        }
    }



    render(){
        return(
            <div className={"card"}>
                <div className={"card-body"}>
                    <FaFolderOpen/> {this.props.name}
                </div>
            </div>
        )
    }
}





export class Documents extends Component{

    render(){
        return(
            <div>
                <FolderEvent>
                </FolderEvent>
            </div>
        )
    }
}

//---------------- Events ------------------
export class FolderEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        this.setState({events: eventStore.allEventsForOrganizer});
    }

    handleClick(eventID){
        history.push("/dokumenter/" + eventID);
    }

    render() {

        return (
            <Row>
                {this.state.events.map((item) => {
                    return (
                        <Col className = {"col-4 padding-bottom-10"} onClick={() => this.handleClick(item.eventID)}>
                            <FolderItem name = {item.eventName}/>
                        </Col>
                    );
                })}
            </Row>
        );
    }

}

//------- Categories -------------
export class FolderCategory extends Component {
    constructor(props){
        super(props);
        this.state= {
            folderSpecs: []
        }
    }

    componentDidMount() {
        documentService.getAllDocumentCategoriesForEvent(this.props.match.params.eventID, (list) => {
            this.setState({folderSpecs: list});
        });
    }


    handleClick(documentID){
        history.push("/dokumenter/" + this.props.match.params.eventID + "/" + documentID);
    }

    render() {
        return (
            <Row>
                {this.state.folderSpecs.map((item) => {
                    return (
                        <Col className = {"col-4 padding-bottom-10"} onClick={() => this.handleClick(item.documentID)}>
                            <FolderItem name = {item.documentCategoryName}/>
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

export class File extends Component{
    constructor(props){
        super(props);
        this.state= {
        }
    }

    handleClick(){
        console.log("Clicked")
    }

    componentDidMount() {

    }


    render(){
        return(
            <div className={"card"} onClick={() => this.handleClick()}>
                <div className={"card-header text-center"}></div>
                <div className={"card-body"}>
                    <p className={"card-text text-center"}>
                        <FaFolderOpen size = {100}/>
                    </p>
                </div>
            </div>
        )
    }
}









