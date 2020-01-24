import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {TicketType} from "../classes/ticketType";
import {CrewMember} from "../classes/crewMember";
import {CrewLeader} from "../classes/crewLeader";


export class PersonellView extends Component{

    //personell = [{name : 'Tore'}, {name : 'Oda'}, {name : 'Herman'}];
    tickets = TicketType.getTestTicketTypes();
    personell = CrewMember.getTestCrewMember();
    leader = CrewLeader.getTestCrewLeader();


    render() {
        return(
            <Card.Body>
                <Card.Title>Leder</Card.Title>
                {this.leader.map(leader => (
                    <div>
                        <Row>
                            <Col>
                                <ListGroup.Item>Navn:   {leader.contactName}</ListGroup.Item>
                            </Col>
                            <Col>
                                <ListGroup.Item>Mobil:  {leader.phone}</ListGroup.Item>
                            </Col>
                            <Col>
                                <ListGroup.Item>Email:  {leader.email}</ListGroup.Item>
                            </Col>
                        </Row>
                    </div>
                ))}
                <Card.Title>Personell</Card.Title>
                {this.personell.map(person =>(
                    <div>
                        <ListGroup>
                            <Row>
                                <Col>
                                    <ListGroup.Item>Navn:   {person.contactName}</ListGroup.Item>
                                </Col>
                                <Col>
                                    <ListGroup.Item>Mobil:  {person.phone}</ListGroup.Item>
                                </Col>
                                <Col>
                                    <ListGroup.Item>Email:  {person.email}</ListGroup.Item>
                                </Col>
                            </Row>


                        </ListGroup>
                    </div>
                ))}

            </Card.Body>
        );
    }
}