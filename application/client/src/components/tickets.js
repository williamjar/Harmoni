import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";


export class Tickets extends Component{
    render() {
        return(
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group>
                        <Form.Label>Billetter</Form.Label>
                        </Form.Group>
                        <Form.Row>
                            <Col sm={2}>
                                <Form.Control placeholder="Standard"/>
                            </Col>
                            <Col  sm={1}>
                                <Form.Control placeholder="Pris"/>
                            </Col>
                            <Col  sm={1}>
                                <Form.Control placeholder="Antall"/>
                            </Col>
                            <Col  sm={1}>
                                <Form.Control placeholder="Slipp Dato"/>
                            </Col>
                            <Col  sm={1}>
                                <Form.Control placeholder="Klokkeslett"/>
                            </Col>
                        </Form.Row>
                    </Form>
                    <Form>
                        <Form.Row>
                            <Col sm={5}>
                                <Form.Control placeholder="Beskrivelse"/>
                            </Col>
                        </Form.Row>
                    </Form>

                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        )
    }
}