import React from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "./components/menu/navigation";
import {Content} from "./components/content/content";
import { HashRouter, Route} from 'react-router-dom';
import {AddPerformer, Performers} from "./components/content/performers";
import {GetTicket} from "./components/ticket";



function App() {
  return (
    <div className="App">
        <HashRouter>
            <div className="row no-gutters">
                <div className="col-lg-2">
                    <NavBar />
                </div>

                <div className="col-lg-10">
                    <Route exact path="/" component={() => <Content page="test" />} />
                    <Route exact path="/opprett"/>
                    <Route exact path="/artister" component={() => <Content page={<GetTicket/>} />} />
                    <Route exact path="/personell" component={Content}/>
                    <Route exact path="/kontrakter" component={Content}/>
                </div>
            </div>
        </HashRouter>
    </div>
  );
}

export default App;
