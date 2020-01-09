import React, {Component} from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';



export class NavBar extends Component{
    render(){
        return(
            <div className="Nav-Menu card">
                Harmoni Logo
                <div className="nav-links">
                    <div className="nav flex-column nav-pills" id="" role="tablist"
                         aria-orientation="vertical">

                        <NavLink className="nav-link" to="/" exact={true}>
                            Dine arrangement
                        </NavLink>

                        <NavLink className="nav-link" to="/opprett">
                            Opprett arrangement
                        </NavLink>

                        <NavLink className="nav-link" to="/artister">
                            Artister
                        </NavLink>

                        <NavLink className="nav-link" to="/personell">
                            Personell
                        </NavLink>

                        <NavLink className="nav-link" to="/kontrakter">
                            Kontrakter
                        </NavLink>
                    </div>

                </div>

                <div className="user-nav">
                    <div className="row">
                        <div className="col-3">
                            <img src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/19339625881548233621-512.png" width={50} alt=""/>
                        </div>
                        <div className="col-9">
                            <b>Navn Navnesen</b><br/>
                            Arrangør
                        </div>
                    </div>
                </div>



            </div>
        )
    }
}