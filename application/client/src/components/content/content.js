import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from "../alerts";


export class Content extends Component{
    /* Container to serve content in a strict page layout */

    render(){
        return(
            <div className="content">
                <div className="padding-top-25-mobile">
                <Alert/>
                </div>
                <div className="card min-height-800 content-container">
                    <div className="card-body">
                {this.props.page}
                    </div>
                </div>
            </div>
        )
    }
}

export class SimpleContent extends Component{
    /* Container to serve content in a strict page layout
    * Similar to Content class, but used for few and small components, like "opprett arrangement" */

    render() {
        return (
            <div className="card simple-content center simple-content-top">
                <Alert/>
                {this.props.page}
            </div>
        );
    }
}




