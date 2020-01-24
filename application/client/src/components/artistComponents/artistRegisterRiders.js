import React, {Component} from 'react';
import {Row, Col, Button} from 'react-bootstrap';
import InputGroup from "react-bootstrap/InputGroup";
import {DocumentService as documentService, DocumentService} from "../../store/documentService";
import {ArtistService} from "../../store/artistService";
import {RiderStore} from "../../store/riderStore";
import {Document} from "../../classes/document";
import {
    FaAngleDown,
    FaFileAlt,
    FaFileArchive,
    FaFileExcel,
    FaFileImage,
    FaFilePdf,
    FaFilePowerpoint,
    FaFileWord, FaTrashAlt
} from "react-icons/all";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import FormControl from "react-bootstrap/FormControl";
import {Alert} from "../alerts";

/**
 * @class ArtistRegisterRiders
 * @classdesc Used for the artist to be able to add, delete and edit riders for an event.
 */
export class ArtistRegisterRiders extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            riderElements: [],
            documents: [],
            artistID: -1,
            riderInput: ""
        }
    }

    render() {
        if (this.state.artistID < 0){
            return <h3 className={"mt-4 mb-4"}>Ikke en gyldig artist-lenke.</h3>;
        }
        else{
            return (
                <Card className="border-0 m-4">

                    <Card.Body>
                        <Card.Text>Artistside for arrangementet</Card.Text>
                        <h4 className={"mt-4 mb-4"}>Filer knyttet til dette arrangmentet</h4>
                        <Documents documents={this.state.documents}/>
                        <h4 className={"mt-4 mb-4"}>Legg til rider for dette arrangementet</h4>
                        <Row>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        placeholder="feks. jeg vil ha suppe"
                                        aria-label=""
                                        aria-describedby="basic-addon2"
                                        value={this.state.riderInput}
                                        onChange={this.handleInputRider}
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-secondary" onClick={this.addRider}>Legg til rider</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button className="btn-primary btn-file">Last opp riders som PDF <input type="file" id="uploadAttachmentPerformer" accept="application/pdf" onChange={() => this.addFile()}/></Button>
                            </Col>
                        </Row>

                        <h4 className={"mt-4 mb-4"}>Dine riders</h4>
                        {
                            this.state.riderElements.map(rider => {
                                if (rider.artistID === this.state.artistID){
                                    return <Rider key={rider.riderID} description={rider.description} isDone={rider.isDone} status={rider.status} riderObject={rider} deleteRider={this.deleteRider}/>
                                }
                                else{
                                    return null;
                                }
                            })
                        }
                    </Card.Body>
                </Card>

            );
        }
    }

    deleteRider = (rider) => {
        let currentRiders = this.state.riderElements;
        currentRiders = currentRiders.filter(r => r.riderID !== rider.riderID);
        this.setState({riderElements: currentRiders});

        RiderStore.deleteRiderFromArtistPage(this.state.token, this.state.eventID, this.state.artistID, rider.riderID, (status, data) => {
            if (status !== 200){
                Alert.info("Noe skjedde. Vennligst prøv igjen om rideren ikke fjernes ved å oppdatere siden.");
            }
        })
    };

    addFile = (event) => {
        try{
            let fileInput = document.querySelector("#uploadAttachmentPerformer");
            let attachment = fileInput.files[0];
            let filename = attachment.name;
            let formData = new FormData();
            formData.append('selectedFile', attachment);
            formData.append('description', filename);
            DocumentService.addDocumentFromArtistPage(this.state.token, this.state.eventID, this.state.artistID, formData, (status, data) => {
                if (status === 200 && data.documentLink && data.documentID){
                    let currentDocuments = this.state.documents;
                    currentDocuments.push(new Document(data.documentID, this.state.eventID, data.documentLink.split("_")[1], data.documentLink, this.state.artistID, null, 2));
                    this.setState({documents: currentDocuments});
                }
                else {
                    Alert.info("Noe hendte. Vennligst prøv igjen");
                }
            });

        }
        catch (e) {
            Alert.info("Something went wrong, please try again");
        }


    };

    handleInputRider = (event) =>{
        /* Handles the rider input for new riders to be added to state variable */
        let currentState = this.state;
        currentState.riderInput = event.target.value;
        this.setState(currentState);
    };

    addRider = (event) => {
        if(this.state.riderInput.trim() !== ""){
            RiderStore.createNewRiderElementFromArtistLogin(this.state.token, this.state.artistID, this.state.eventID, this.state.riderInput, (statusCode, newRider) => {
                if (statusCode === 200 && newRider){
                    let currentState = this.state;
                    let currentRiders = currentState.riderElements;
                    currentRiders.push(newRider);
                    currentState.riderInput = "";
                    this.setState(currentState);
                    Alert.success("Rider er lagt til for arrangementet.")
                }
                else{
                    Alert.danger("Det skjedde en feil, vennligst prøv igjen senere.");
                }

            });
        } else{
            Alert.danger("Rider kan ikke være blank");
        }
    };

    componentDidMount() {
        const realToken = this.props.match.params.token.replace(/\+/g, ".");
        ArtistService.decodeToken(realToken, (status, data) => {
            if (status === 200){
                const artistID = data.data.artistID;
                const eventID = data.data.eventID;

                this.setState({artistID: artistID, eventID: eventID, token: realToken});
                DocumentService.getAllDocumentsForArtist(artistID, eventID, realToken, (status, res) => {
                    if (status === 200 && res){
                        this.setState({documents: res});
                    }
                    else{
                        console.log("No documents loaded.");
                    }
                });
                RiderStore.getAllRidersForArtistByEvent(artistID, eventID, realToken, (status, res) => {
                    if (status === 200 && res){
                        this.setState({riderElements: res});
                    }
                    else{
                        console.log("No riders loaded");
                    }
                });
            }
            else{
                console.log("Error loggin in.");
            }
        });
    }
}

class Documents extends Component{

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

    render(){
        return(
            <section>
                {this.props.documents.map((item) => {
                    return (
                        <Accordion defaultActiveKey="1" key={item.documentID}>
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


    render() {
        return (
            <Row className = {"bg-light padding-top-20 padding-bottom-20"}>
                <Col size = {4}>
                    <Button variant="primary" onClick = {() => this.downloadDocument()}> Last ned </Button>
                    {this.previewButton()}
                </Col>
            </Row>
        );
    }
}

class Rider extends Component{
    /* This component shows information pertaining to one rider, it receives information thorugh props from
    * parent and displays it in this component  */

    render(){
        return(
            <Card className={"mt-2 mb-2 p-2"}>
                <Card.Body className="row align-items-center">
                    <div className="col-4">
                        {this.props.description}
                    </div>

                    <div className="col-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" disabled={true} checked={this.props.isDone === 1 || this.props.isDone} name="taskDone" onChange={this.handleCheckBoxInput}/>
                            <label className="form-check-label" htmlFor="riderCompleted">
                                Utført
                            </label>
                        </div>
                    </div>

                    <div className="col-4">
                        <input type="text" className="form-control" placeholder="Status" value={this.props.status} disabled={true} name="status" onChange={this.handleStatusInput}/>
                    </div>
                    <div className="col-1">
                        <button className="btn btn-danger" onClick={this.deleteRider}><FaTrashAlt/></button>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    deleteRider = () => {
        this.props.deleteRider(this.props.riderObject);
    }

}