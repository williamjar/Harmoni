import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Row} from "react-bootstrap";



export class TabContent extends Component {

    render(){
        return(
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col xs={12} md={8}>
                        <Button variant="danger">Slett arrangement</Button>
                    </Col>
                    <Col xs={6} md={4}>
                        <Button className="mr-1" onClick={this.props.onClick}>Neste</Button>
                        <Button className="mr-1" variant="secondary">Lagre og lukk</Button>
                        <Button  className="mr-1" disabled variant="success">Publiser</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}