import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export class DocList extends Component {

    state = {activeDocument : null};

    getDocument = (event) => {
        let target = event.target;
        let value = target.value;
        this.setState( {activeDocument : [value]});
        console.log(value);
    };
    list = [
        {name : 'Tore', age : 22}, {name : 'Trond', age : 30}, {name : 'Halvor', age : 19},
        {name : 'Jesper', age : 10}, {name : 'Jesus', age : 2000}, {name : 'Olge', age :31}
    ];
    render() {
        return(
            <Card>
                <Card.Body>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Dokumneter</Form.Label>
                        <Form.Control as="select" multiple>
                            {this.list.map( person => (
                                <option key={person.age}
                                        value= {person.name}
                                        onClick={this.getDocument}
                                >
                                    {person.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form>
                        <Form.Label>Et dokumnet</Form.Label>
                        <p>{this.state.activeDocument}</p>


                    </Form>
                </Card.Body>
            </Card>

        );
    }
}

