import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../config/firebase';
import './navTop.css';

class Guest extends Component {
    render() {
        return (
            <ul>
                <li>
                    <Link to="/login">
                        Login
                    </Link>
                </li>
                <li>
                    <Link to="/register">
                        Register
                    </Link>
                </li>
            </ul>
        )
    }
}

class User extends Component {
    login = (name) => {
        return name.split("@")[0];
    }
    render() {
        const {name, avatar} = this.props;
        return (
            <ul>
                <li className="user">
                    <Link to="/profile">
                        <img width="32px" height="32px" alt="" src={avatar}></img>
                        {this.login(name)}
                    </Link>
                </li>
                <li>
                    <Link to="/add-video">
                        Add video
                    </Link>
                </li>
                <li>
                    <Link to="/logout">
                        Logout
                    </Link>
                </li>
            </ul>
        )
    }
}

class NavTop extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            userAvatar: '',
            searchValue: null
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({
                user: user
            })
            firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                snapshot.forEach((childSnap) => {
                    let userData = childSnap.val();
                    this.setState({
                        userAvatar: userData.avatar
                    });
                });
            });
          })
    }
    handleSearchInput = (e) => {
        this.setState({searchValue: e.target.value});
    }
    handleSearchSubmit = (e) => {
        e.preventDefault();
        this.props.history.push('/search/'+this.state.searchValue);
    }
    render() {
        return (
            <nav className="topNav">
                <div className="search">
                    <form onSubmit={this.handleSearchSubmit}>
                        <input onChange={this.handleSearchInput} placeholder="Search..." type="text"></input>
                    </form>
                </div>
                {   
                    this.state.user ? (
                        <User avatar={this.state.userAvatar} name={this.state.user.email}/>
                    ) : (
                        <Guest />
                    )
                }
            </nav>
        )
    }
}

export default withRouter(NavTop);