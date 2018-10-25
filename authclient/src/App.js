import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';

import Users from './users/Users';
import Login from './auth/Login';

import './App.css';

const Home = props => {
  return (
    <div>
      <h1>Home Component</h1>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <NavLink to="/" exact>
              Home
            </NavLink>
            &nbsp; | &nbsp;
            <NavLink to="/users">Users</NavLink>
            &nbsp; | &nbsp;
            <NavLink to="/signin">Signin</NavLink>
            &nbsp; | &nbsp;
            <button onClick={this.signout}>Signout</button>
          </nav>
          <main>
            <Route exact path="/" component={Home} />
            <Route path="/users" component={Users} />
            <Route path="/signin" component={Login} />
          </main>
        </header>
      </div>
    );
  }

  signout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };
}

export default App;
