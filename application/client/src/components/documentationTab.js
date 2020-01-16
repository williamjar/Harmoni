import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Dropzone from 'react-dropzone';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import {DocumentService} from "../store/documentService";
import {EventStore} from "../store/eventStore";

export class DocumentationTab extends Component{

    constructor() {
        super();
        this.state = {
            description: '',
            selectedFile: ''
        };
    }

    onChange = (e) => {
        if (e.target.name === 'selectedFile') {
            this.setState({selectedFile: e.target.files[0]});
        } else {
            this.setState({[e.target.name]: e.target.value});
        }
    };

    onSubmit = (e) => {
        e.preventDefault();
        const {description, selectedFile} = this.state;
        let formData = new FormData();
        formData.append('description', description);
        formData.append('selectedFile', selectedFile);
        DocumentService.addDocument(EventStore.currentEvent.eventID, "Kontrakt", null, null, 1, formData, statusCode => {
            if (statusCode === 200){
                alert("Document was added!");
            }
            else{
                alert("There was an error, please try again or contact us.");
            }
        })
    };

    render(){
        const {description, selectedFile} = this.state;
        return (
            <div>
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={this.onChange}
                />
                <input
                    type="file"
                    name="selectedFile"
                    onChange={this.onChange}
                />
                <button type="button" onClick={this.onSubmit}>Last opp fil</button>
            </div>

        )
    }

    /*
    //Uploads files to server
    onDrop(acceptedFiles){
        let formDataFiles = new FormData();
        formDataFiles.append('files', acceptedFiles);
        console.log("Files added in form: " + formDataFiles);
        //TODO: Change category available in Sprint 2
        DocumentService.addDocument(EventStore.currentEvent.eventID, "Kontrakt", null, null, 1, formDataFiles, () => {
            console.log("Document added");
        });
    };



    //Renders a dropzone to drop pdf files.
    render() {
        return (
            <Card.Body>
                <h3>Legg til dokumenter</h3>
                <div className="dropzone">
                        <Dropzone
                            onDrop={this.onDrop}
                            accept="application/pdf"
                        >
                            {({getRootProps, getInputProps}) => (
                                <div {...getRootProps()}>
                                    <input  {...getInputProps()} />

                                    <h1><FaArrowAltCircleDown/></h1>
                                    Legg til filer her!
                                </div>
                            )}
                        </Dropzone>
                </div>
            </Card.Body>
        );

        }
        */

}
