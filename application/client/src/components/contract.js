import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FaFolder, FaFolderOpen} from "react-icons/all";
import { createHashHistory } from 'history';
import {DocumentService as documentService} from "../store/documentService";
import {DocumentCategory} from "../classes/documentCategory";
import {OrganizerStore as organizerStore} from "../store/organizerStore";

const history = createHashHistory();



export class FolderItem extends Component{
    constructor(props){
        super(props);
        this.state= {
        }
    }

    handleClick(){
        console.log("Clicked")
    }

    render(){
        return(
            <div className={"card"} onClick={() => this.handleClick()}>
                <div className={"card-body"}>
                    <FaFolderOpen/> {this.props.name}
                </div>
            </div>
        )
    }
}

/*

export class FileItem extends Component{
    constructor(props){
        super(props);
        this.state= {
        }
    }

    handleClick(){
        console.log("Clicked")
    }

    componentDidMount() {
        this.checkFileType(this.props.fileName)
    }

    checkFileType(file){
        //Velg hvilket icon
    }


    render(){
        return(
            <div className={"card"} onClick={() => this.handleClick()}>
                <div className={"card-header text-center"}>{this.props.fileName}</div>
                <div className={"card-body"}>
                    <p className={"card-text text-center"}>
                        <FaFolderOpen size = {100}/>
                    </p>
                </div>
            </div>
        )
    }
}

 */


//---------------- Events ------------------
export class FoldersEvents extends Component{
    constructor(props){
        super(props);
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        organizerStore.getAllEvents(organizerStore.currentOrganizer)
            .then(event => this.setState({events: event}));
    }

    render() {

        return (
            <Row>
                {this.state.events.map((item) => {
                    return (
                        <Col className = {"col-4"}>
                            <FolderItem name = {item.eventName}/>
                        </Col>
                    );
                })}
            </Row>
        );
    }

}


//------- Categories -------------
export class Folders extends Component {
    constructor(props){
        super(props);
        this.state= {
            folderSpecs: []
        }
    }

    componentDidMount() {
        console.log("EventID " + this.props.eventID);
        documentService.getAllDocumentCategoriesForEvent(this.props.eventID, (list) => {
            this.setState({folderSpecs: list});
        });
    }

    // Handles when the user
    viewEvent = () => {
        //history.push("/kontrakter/" + this.props.id");
        history.push("/kontrakter");
    };

    render() {
        return (
            <Row>
                {this.state.folderSpecs.map((item) => {
                    return (
                        <Col className = {"col-4"}>
                            <FolderItem name = {item.documentCategoryName}/>
                        </Col>
                    );
                })}
            </Row>
        );
    }
}



export class Documents extends Component{

    render(){
        return(
            <div>
                <Folders eventID = {45}>

                </Folders>
                <FoldersEvents>

                </FoldersEvents>
            </div>
        )
    }
}
