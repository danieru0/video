import React, { Component } from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import NavTop from './components/NavTop/navTop.js';
import Head from './components/Head/head';
import SideNav from './components/SideNav/sidenav';
import Login from './components/Login/login';
import Register from './components/Register/register';
import Video from './components/AddVideo/addvideo';
import Watch from './components/Watch/watch';
import Liked from './components/Liked/liked';
import Search from './components/Search/search';
import firebase from './config/firebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      logged: false
    };
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        user: user
      })
    })
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
      firebase.auth().signOut().then(() => {
        window.location.href = '/';
      })
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
              <Route path="/add-video" render={() => (this.isLoggedIn() ? <Video />: <Redirect to="/"/>)}/>
              <Route path="/logout" render={() => (this.isLoggedIn() ? this.logout() : <Redirect to="/"/>)}/>
              <Route path="/watch/:id" component={Watch} />
              <Route path="/liked" render={() => (this.isLoggedIn() ? <Liked />: <Redirect to="/"/>)} />
              <Route path="/search/:value" component={Search} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
