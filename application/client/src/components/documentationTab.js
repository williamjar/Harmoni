import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Dropzone from 'react-dropzone';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";




export class DocumentationTab extends Component{


    onDrop(acceptedFiles){
        console.log(acceptedFiles);
    };

    render() {
        return (
            <Card.Body>
                <h3>Legg til dokumnter</h3>
                <div className="dropzoneForm">
                    <Form>
                        <Dropzone onDrop={this.onDrop} className="dropzone">
                            {({getRootProps, getInputProps}) => (
                                <div {...getRootProps()}>
                                    <input  {...getInputProps()} />
                                    <h1><FaArrowAltCircleDown/></h1>
                                    Legg til filer her!
                                </div>
                            )}
                        </Dropzone>
                    </Form>
                </div>



            </Card.Body>
        );
    }
}
