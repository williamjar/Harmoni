import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FaFileImage, FaFilePowerpoint,FaFileExcel,FaFileArchive,FaFileWord, FaFilePdf, FaFileAlt, FaFolderOpen} from "react-icons/all";
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
            documentInfo: {}
        }
    }

    //TODO: show information of file - render component
    handleClick(documentID){
        console.log("Clicked document with id " + documentID);
        documentService.getOneDocument(this.props.match.params.eventID, documentID,(document) => {
            this.setState({documentInfo: document});
        });
        //TODO: get info from service
        console.log(this.state.documentInfo.documentName);
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
        else if((/\.(xlsx)$/i).test(fileName)){
            return <FaFileExcel size = {25}/>
        }
        //Word
        else if((/\.(doc)$/i).test(fileName)){
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
            <ul className={"list-group"}>
                {this.state.document.map((item) => {
                    return (
                        <li className = {"list-group-item"} onClick={() => this.handleClick(item.documentID)}>
                            {this.checkFileType(item.documentName)} {item.documentName}
                        </li>
                    );
                })}
            </ul>
        )
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
            <ul className="list-group">
                <li className="list-group-item disabled">Cras justo odio</li>
                <li className="list-group-item">Dapibus ac facilisis in</li>
                <li className="list-group-item">Morbi leo risus</li>
                <li className="list-group-item">Porta ac consectetur ac</li>
                <li className="list-group-item">Vestibulum at eros</li>
            </ul>

        )
    }
}







