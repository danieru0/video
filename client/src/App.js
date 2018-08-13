import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import NavTop from './components/NavTop/navTop.js';
import Head from './components/Head/head';
import SideNav from './components/SideNav/sidenav';
import Login from './components/Login/login';
import Register from './components/Register/register';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      logged: false
    };
  }
  componentDidMount() {
    fetch('api/user')
      .then(res => res.json())
      .then(res => {
        this.setState({
          user: res
        });
    });
  }
  isLoggedIn = () => {
    if (this.state.user) {
      return true;
    } else {
      return false;
    }
  }
  logout = () => {
    if (this.state.user) {
      fetch('/logout')
        .then(res => res.json())
        .then(res => {
          window.location.href = '/';
      });
    }
  }
  render() {
    return (
        <BrowserRouter>
          <div>
            <NavTop/>
            <SideNav />
            <Switch>
              <Route exact path="/" component={Head}/>
              <Route path="/login" render={() => (this.isLoggedIn() ? <Redirect to="/"/> : <Login />)}/>
              <Route path="/register" render={() => (this.isLoggedIn() ? <Redirect to="/"/> : <Register />)}/>
              <Route path="/logout" render={() => (this.isLoggedIn() ? this.logout() : <Redirect to="/"/>)}/>
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
