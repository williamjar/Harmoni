import React from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "./components/menu/navigation";
import {Content} from "./components/content/content";
import { HashRouter, Route} from 'react-router-dom';
import {Dashboard} from "./components/dashboard";



function App() {
  return (
    <div className="App">
        <HashRouter>
            <div className="row no-gutters">
                <div className="col-lg-2">
                    <NavBar />
                </div>

                <div className="col-lg-10">
                    <Route exact path="/" component={() => <Content page={<Dashboard />} />} />
                    <Route exact path="/opprett" component={Content}/>
                    <Route exact path="/artister" component={Content}/>
                    <Route exact path="/personell" component={Content}/>
                    <Route exact path="/kontrakter" component={Content}/>
                </div>
            </div>
        </HashRouter>
    </div>
  );
}

export default App;
