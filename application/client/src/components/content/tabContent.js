import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card} from "react-bootstrap";



export class TabContent extends Component{
    render(){
        return(
            <div className="tabContent">
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}