import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Row} from "react-bootstrap";
import {FaCalendarTimes, FaFileUpload,FaAngleDown,FaFileImage, FaFilePowerpoint,FaFileExcel,FaFileArchive,FaFileWord, FaFilePdf, FaFileAlt, FaFolderOpen} from "react-icons/all";
import { createHashHistory } from 'history';
import {DocumentService as documentService} from "../store/documentService";
import {EventStore as eventStore} from "../store/eventStore";
import Accordion from "react-bootstrap/Accordion";
import {CookieStore} from "../store/cookieStore";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const history = createHashHistory();

/**
 * @class FolderItem
 * @classdesc Component for document folders.
 */
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

/**
 * @class MyDocuments
 * @classdesc A component over a users documents.
 */
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
/**
 * @class MyDocuments
 * @classdesc A component for a folder of a event.
 */
export class FolderEvent extends Component{
    constructor(props){
        super(props);
        this.state = {
            events: []
        }
    }

    componentDidMount() {
        eventStore.storeAllEventsForOrganizer(() => {
            this.setState({events: eventStore.allEventsForOrganizer});
        }, CookieStore.currentUserID);
    }

    handleClick(eventID){
        history.push("/dokumenter/" + eventID);
    }
    check(){
        if(this.state.events.length === 0){
            return(
                <section className={"icon-center"}>
                    <FaCalendarTimes size={200}/>
                    <h1 className={"padding-top-10"}>Ingen opprettede arrangementer</h1>
                </section>
            );
        }
    }

    render() {

        return (
            <div className="padding-top-30-mobile">
                {this.check()}
                <Row>

                    {this.state.events.map((item) => {
                        return (
                            <Col key={item.eventID} className = {"col-4 padding-bottom-10"} onClick={() => this.handleClick(item.eventID)}>
                                <FolderItem name = {item.eventName}/>
                            </Col>
                        );
                    })}

                </Row>
            </div>
        );
    }

}

/**
 * @class MyDocuments
 * @classdesc A component for a category of folders.
 */
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

    check(){
        if(this.state.folderSpecs.length === 0){
           return(
               <section className={"icon-center"}>
                   <FaFileUpload size={200}/>
                   <h1 className={"padding-top-10"}>Ingen opplastede dokumenter</h1>
               </section>
           );
        }
    }

    render() {
        return (
            <div className="padding-top-30-mobile">
                {this.check()}
                <Row>

                    {this.state.folderSpecs.map((item) => {
                        return (
                            <Col key={item.documentCategoryID} className = {"col-4 padding-bottom-10"} onClick={() => this.handleClick(item.documentCategoryID)}>
                                <FolderItem name = {item.documentCategoryName}/>
                            </Col>
                        );
                    })}
                </Row>
            </div>

        );
    }
}

/**
 * @class Documents
 * @classdesc Component for deleting and sorting documents.
 */
export class Documents extends Component{
    constructor(props){
        super(props);
        this.state= {
            document: [],
            active: "nylige"
        }
    }

    componentDidMount() {
        documentService.getAllDocumentsByCategoryForEvent(this.props.match.params.eventID, this.props.match.params.documentCategoryID,(list) => {
            this.setState(
                {document: list.sort(function(a, b){
                    if(a.documentID > b.documentID) { return -1; }
                    if(a.documentID < b.documentID) { return 1; }
                    return 0;
                })
                });

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

    deleteDocument = (documentID, documentLink, documentCategoryID) => {
        let document =  this.state.document.find(e => e.documentID === documentID);
        let index = this.state.document.indexOf(document);
        let currentState = this.state;
        currentState.document.splice(index, 1);
        this.setState(currentState);

        documentService.deleteDocument(documentID, documentLink);

        if(this.state.document.length === 0){
            history.push('/dokumenter');
        }


    };

    orderByNewest = (e) => {
        let listSorted = this.state.document;

        if(listSorted !== null){
            listSorted.sort(function(a, b){
                let fileA = a.documentID;
                let fileB = b.documentID;
                if(fileA > fileB) { return -1; }
                if(fileA < fileB) { return 1; }
                return 0;
            })
        }
        this.setState({documents: listSorted, active: e.target.name});
    };

    orderByFileExt = (e) => {
        let listSorted = this.state.document;

        if(listSorted !== null){
            listSorted.sort(function(a, b){
                let fileA = a.documentName.substr(a.documentName.lastIndexOf('.') + 1);
                let fileB = b.documentName.substr(b.documentName.lastIndexOf('.') + 1);
                if(fileA < fileB) { return -1; }
                if(fileA > fileB) { return 1; }
                return 0;
            })
        }
        this.setState({documents: listSorted, active: e.target.name});
    };

    orderByFileName = (e) => {
        let listSorted = this.state.document;

        if(listSorted !== null){
            listSorted.sort(function(a, b){
                let fileA = a.documentName.toLowerCase();
                let fileB = b.documentName.toLowerCase();
                if(fileA < fileB) { return -1; }
                if(fileA > fileB) { return 1; }
                return 0;
            })
        }
        this.setState({documents: listSorted, active: e.target.name});
    };

    render(){
        return(
            <div className="padding-top-30-mobile">
            <section>
                <Row className = {"padding-bottom-10"}>
                    <Col>
                          <ButtonGroup>
                            <Button name="nylige" onClick = {this.orderByNewest} variant="secondary" active={this.state.active === "nylige"}>Nylige</Button>
                            <Button name = "filnavn" onClick = {this.orderByFileName} variant="secondary" active={this.state.active === "filnavn"}>Filnavn</Button>
                            <Button name = "filtype" onClick = {this.orderByFileExt} variant="secondary" active={this.state.active === "filtype"}>Filtype</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                {this.state.document.map((item) => {
                    return (
                        <Accordion key={item.documentID} defaultActiveKey="1" >
                            <Row className = {"w-100 text-primary border-bottom"}>
                                <Col>
                                    <Accordion.Toggle as={Button} variant="link text-dark" eventKey="0" className={"folder"}>
                                        {this.checkFileType(item.documentName)} {item.documentName} <FaAngleDown/>
                                    </Accordion.Toggle>
                                </Col>
                            </Row>
                            <Accordion.Collapse eventKey="0">
                                <Info eventID = {this.props.match.params.eventID} documentCategoryID = {this.props.match.params.documentCategoryID} deleteDocument = {this.deleteDocument} documentID = {item.documentID} documentLink = {item.documentLink} documentName = {item.documentName}/>
                            </Accordion.Collapse>
                        </Accordion>
                    );
                })}
            </section>
            </div>
        )
    }
}

/**
 * @class Info
 * @classdesc Component for previewing and downloading documents.
 */
class Info extends Component {
    constructor(props){
        super(props);
        this.state= {
            documentID: this.props.documentID,
            documentLink: this.props.documentLink,
            documentName: this.props.documentName,
            eventID: this.props.eventID,
            documentCategoryID: this.props.documentCategoryID,
            artist: {},
            crew: {}
        }
    }

    downloadDocument(){
        documentService.downloadDocument(this.state.documentLink, this.state.documentName);
    }

    viewHandler = async () => {
        documentService.previewDocument(this.state.documentLink);
    };

    previewButton(){
        if ((/\.(pdf)$/i).test(this.state.documentLink)) {
            return (
                <Button variant="outline-info" onClick={this.viewHandler}> Åpne </Button>
            );
        }
    }

    componentDidMount() {
        documentService.getArtistInfoConnectedToDocument(this.state.documentID,(artistObj) => {
            this.setState({artist: artistObj});
        });

        documentService.getCrewInfoConnectedToDocument(this.state.documentID,(crewObj) => {
            this.setState({crew: crewObj});
        });
    }

    associatedContact(){
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
                    <Button variant="primary" className="margin-right-10" onClick = {() => this.downloadDocument()}> Last ned </Button>
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
                    <Button onClick = {() => this.props.deleteDocument(this.state.documentID, this.state.documentLink, this.state.documentCategoryID)} variant="danger"> Slett </Button>
                </Col>
            </Row>
        );
    }
}






