import React from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "./components/menu/navigation";



function App() {
  return (
    <div className="App">
      <div className="row">
          <div className="col-lg-2">
          <NavBar />
          </div>


          <div className="col-lg-9">
              content
          </div>





      </div>

    </div>
  );
}

export default App;
