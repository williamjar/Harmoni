import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Dropzone from 'react-dropzone';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import Form from "react-bootstrap/Form";

export class DocumentationTab extends Component{

    //Prints out the adde files in the console log.
    onDrop(acceptedFiles){
        console.log(acceptedFiles);
    };

    //Renders a dropzone to drop files.
    render() {
        return (
            <Card.Body>
                <h3>Legg til dokumnter</h3>
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
}
