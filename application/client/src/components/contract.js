import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FaAngleDown,FaFileImage, FaFilePowerpoint,FaFileExcel,FaFileArchive,FaFileWord, FaFilePdf, FaFileAlt, FaFolderOpen} from "react-icons/all";
import { createHashHistory } from 'history';
import {DocumentService as documentService} from "../store/documentService";
import {DocumentCategory} from "../classes/documentCategory";
import {OrganizerStore as organizerStore} from "../store/organizerStore";
import {EventStore as eventStore} from "../store/eventStore";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";



const history = createHashHistory();

export class FolderItem extends Component{
    constructor(props){
        super(props);
        this.state= {
        }
    }



    render(){
        return(
            <div className={"card folder"}>
                <div className={"card-body"}>
                    <FaFolderOpen/> {this.props.name}
                </div>
            </div>
        )
    }
}





export class MyDocuments extends Component{

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


    handleClick(documentCategoryID){
        history.push("/dokumenter/" + this.props.match.params.eventID + "/" + documentCategoryID);
    }

    render() {
        return (
            <Row>
                {this.state.folderSpecs.map((item) => {
                    return (
                        <Col className = {"col-4 padding-bottom-10"} onClick={() => this.handleClick(item.documentCategoryID)}>
                            <FolderItem name = {item.documentCategoryName}/>
                        </Col>
                    );
                })}
            </Row>
        );
    }
}

export class Documents extends Component{
    constructor(props){
        super(props);
        this.state= {
            document: [],
        }
    }

    componentDidMount() {
        documentService.getAllDocumentsByCategoryForEvent(this.props.match.params.eventID, this.props.match.params.documentCategoryID,(list) => {
            this.setState({document: list});
        });
    }

    //Returns which icon should be displayed
    checkFileType(fileName){
        //Picture
        if((/\.(ai)$/i).test(fileName) || (/\.(jpeg)$/i).test(fileName) || (/\.(jpg)$/i).test(fileName) || (/\.(png)$/i).test(fileName)){
            return <FaFileImage size = {25}/>
        }
        //PDF
        else if((/\.(pdf)$/i).test(fileName)){
            console.log("pdf");
            return <FaFilePdf size = {25}/>
        }
        //Powerpoint
        else if((/\.(pptx)$/i).test(fileName) || (/\.(ppt)$/i).test(fileName)){
            return <FaFilePowerpoint size = {25}/>
        }
        //Excel
        else if((/\.(xlsx)$/i).test(fileName) || (/\.(xls)$/i).test(fileName)){
            return <FaFileExcel size = {25}/>
        }
        //Word
        else if((/\.(docx)$/i).test(fileName) || (/\.(doc)$/i).test(fileName)){
            return <FaFileWord size = {25}/>
        }
        //Compressed File
        else if((/\.(rar)$/i).test(fileName) || (/\.(7z)$/i).test(fileName) || (/\.(zip)$/i).test(fileName)){
            return <FaFileArchive size = {25}/>
        }
        else {
            return <FaFileAlt size = {25}/>
        }
    }

    render(){
        return(
            <section>
                {this.state.document.map((item) => {

                    return (
                        <Accordion defaultActiveKey="1">
                            <Row className = {"folder text-primary border-bottom"}>
                                <Col>
                                    <Accordion.Toggle as={Button} variant="link text-dark" eventKey="0">
                                        {this.checkFileType(item.documentName)} {item.documentName} <FaAngleDown/>
                                    </Accordion.Toggle>
                                </Col>
                            </Row>
                            <Accordion.Collapse eventKey="0">
                                <Info documentID = {item.documentID} documentLink = {item.documentLink} documentName = {item.documentName}/>
                            </Accordion.Collapse>
                        </Accordion>
                    );
                })}
            </section>
        )
    }
}

class Info extends Component {
    constructor(props){
        super(props);
        this.state= {
            artist: {},
            crew: {}
        }
    }

    downloadDocument(){
        documentService.downloadDocument(this.props.documentLink, this.props.documentName);
    }

    viewHandler = async () => {
        documentService.previewDocument(this.props.documentLink);
    };

    previewButton(){
        if ((/\.(pdf)$/i).test(this.props.documentLink)) {
            return (
                <Button variant="outline-info" onClick={this.viewHandler}> Åpne </Button>
            );
        }
    }

    componentDidMount() {
        documentService.getArtistInfoConnectedToDocument(this.props.documentID,(artistObj) => {
            this.setState({artist: artistObj});
        });

        documentService.getCrewInfoConnectedToDocument(this.props.documentID,(crewObj) => {
            this.setState({crew: crewObj});
        });

    }

    associatedContact(){
        //console.log("ID: " + this.props.documentID + " Artist: " + this.state.artist[0].contactName + " Crew: " + this.state.crew[0].contactName);
        if(this.state.crew !== undefined && this.state.crew.contactName !== undefined){
                return(
                    <Row className ={"border-bottom"}>
                        <Col className = {"font-weight-bold font-italic"}>Crew:</Col>
                        <Col>{this.state.crew.contactName}</Col>
                    </Row>
                );

        } else if(this.state.artist !== undefined && this.state.artist.contactName !== undefined ){
            return(
                <Row className ={"border-bottom"}>
                    <Col className = {"font-weight-bold font-italic"}>Artist:</Col>
                    <Col>{this.state.artist.contactName}</Col>
                </Row>
            );
        } else {
            return(
                <Row className ={"border-bottom"}>
                    <Col className = {"font-weight-bold font-italic"}>Dokumentet har ingen tilknytning</Col>
                </Row>
            );
        }
    }


    render() {
        return (
            <Row className = {"bg-light padding-top-20 padding-bottom-20"}>
                <Col size = {4}>
                    <Button variant="primary" onClick = {() => this.downloadDocument()}> Last ned </Button>
                    {this.previewButton()}
                </Col>
                <Col size = {5}>
                    <Row>
                        <Col className = {"padding-bottom-10"}>
                            Tilkobling til:
                        </Col>

                    </Row>
                    {this.associatedContact()}
                </Col>
                <Col size = {3} className={"text-right"}>
                    <Button variant="danger"> Slett </Button>
                </Col>
            </Row>
        );
    }
}






