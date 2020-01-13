import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {AddPerformer, RegisteredPerformers} from "./content/performers";





export class DocView extends Component {
    render() {
        return (
            <div>
                <div className="row">

                    <div className="col-3 border-right">
                        <DocList/>
                    </div>

                    <div className="col-9">
                        <Document/>
                    </div>
                </div>
            </div>

        );
    }
}

export class DocList extends Component {

    test(){
        return null
    }

    list = [{name : 'Tore', age : 22}, {name : 'Trond', age : 30}, {name : 'Halvor', age : 19}];

    render() {
        return(
            <Card>
                <Card.Body>
                    <h5>Dokumneter</h5>
                    <Form>
                        {this.list.map(name => (
                            <div>
                                <ListGroup>
                                    <ListGroup.Item>{name.name}</ListGroup.Item>
                                </ListGroup>
                            </div>
                        ))}
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export class Document extends Component {


    render() {
        return(
            <Card>
                <Card.Body>
                    <p>Her skal en kontrakt vises</p>
                </Card.Body>
            </Card>
        );
    }
}