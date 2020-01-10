import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Row} from "react-bootstrap";



export class TabContent extends Component {

    state = {
        editable: [this.props.editable],
    };

    render(){
        return(
            <div className="tabContent">
                <div className="tabChildren">
                    {this.props.children}
                </div>
                <Row>
                    <Col xs={15} md={10}>
                        {this.state.editable === true ? <Button variant="danger">Slett arrangement</Button> : null}
                    </Col>
                    <Col xs={3} md={2}>
                        {
                            this.state.editable === true ?
                                <div>
                                    <Button className="mr-1" onClick={this.props.onClick}>Neste</Button>
                                    <Button className="mr-1" variant="secondary">Lagre og lukk</Button>
                                    <Button  className="mr-1" disabled variant="success">Publiser</Button>
                                </div> :
                                <Button onClick={this.props.editClicked}>Rediger</Button>
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}