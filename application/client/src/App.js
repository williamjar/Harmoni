import React from 'react';


import 'bootstrap/dist/css/bootstrap.min.css';
import {NavBar} from "./components/menu/navigation";
import {LoginForm} from "./components/login/loginForm";


function App() {
  return (
    <div className="App">
      <div className="row">
          <div className="col-lg-2">
          <NavBar />
          </div>


          <div className="col-lg-9">
              <LoginForm />
          </div>



      </div>

    </div>
  );
}

export default App;
