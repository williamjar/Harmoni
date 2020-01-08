import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export class Search extends Component{


    render() {
        return(
            <div className="card">
                <div className="card-body">
                    <form>
                        <input type="search"
                               value={this.state.concert}
                               onChange={this.handleChange}/>
                    </form>
                </div>
            </div>
        );
    }

    constructor(props){
        super(props);
        this.state = { concert: '' };
    }

    handleChange = event => {
        this.setState({ concert: event.target.value });
        console.log(this.state.concert);
    };

    submit = event =>{

    }
}