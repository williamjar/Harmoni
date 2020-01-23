import {Card} from 'react-bootstrap';
import React, {Component} from 'react';


export class CheckList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        mounted : true
        }
    }


    render(){

        if(this.props.issueList.length<=0){
            return(null)
        } else {
        return (
            <Card className="p-1 border-0">
                {this.props.issueList.map((issue) =>
                    <Card key={issue} className="mt-1" border="danger" >
                        <Card.Body>
                            <Card.Text>
                            {issue}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </Card>
        )}
    }
}