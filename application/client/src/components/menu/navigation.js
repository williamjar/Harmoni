import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from "react-bootstrap/ListGroup";



export class NavBar extends Component{
    render(){
        return(
            <div className="card Nav-Menu">
                Harmoni
                <div className="nav-links">
                    <ListGroup>
                        <ListGroup.Item>Dine arrangement</ListGroup.Item>
                        <ListGroup.Item>Opprett arrangement</ListGroup.Item>
                        <ListGroup.Item>Artister</ListGroup.Item>
                        <ListGroup.Item>Personell</ListGroup.Item>
                        <ListGroup.Item>Kontrakter</ListGroup.Item>
                    </ListGroup>
                </div>

                <div className="user-nav">
                    User
                </div>



            </div>
        )
    }
}