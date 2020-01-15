import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FaFolder, FaFolderOpen} from "react-icons/all";
import { createHashHistory } from 'history';
import {DocumentService as documentService} from "../store/documentService";
import {DocumentCategory} from "../classes/documentCategory";

const history = createHashHistory();

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

        console.log(this.state.folderSpecs);
        return (


            <Row className="grid-container">
                {this.state.folderSpecs.map((item) => {
                    return (
                        <Col className = {"col-4"}>
                            <div className={"card"} onClick={item.viewEvent}>
                                <div className={"card-body"}>
                                    <FaFolderOpen/> {item.documentCategoryName}
                                </div>
                            </div>
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
            <Folders eventID = {45}>

            </Folders>
        )
    }
}

export class Contracts extends Component{


    render(){
        return(
            <Folders eventID = {45}>

            </Folders>
        )
    }
}