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
                        <span className="topNav-text">Login</span>
                        <span className="topNav-icon fa fa-sign-in"></span>
                    </Link>
                </li>
                <li>
                    <Link to="/register">
                        <span className="topNav-text">Register</span>                        
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
                        <span className="topNav-text">{this.login(name)}</span>
                    </Link>
                </li>
                <li>
                    <Link to="/add-video">
                        <span className="topNav-text">Add video</span>
                        <span className="topNav-icon fa fa-upload"></span>
                    </Link>
                </li>
                <li>
                    <Link to="/logout">
                        <span className="topNav-text">Logout</span>
                        <span className="topNav-icon fa fa-sign-out"></span>
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
            searchValue: null,
            menu: false,
            class: null
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
    showSearch = () => {
        if (this.state.menu === false) {
            this.setState({
                menu: true,
                class: "active"
            });
        } else {
            this.setState({
                menu: false,
                class: ''
            });
        }
    }
    render() {
        return (
            <nav className="topNav">
                <div className="search">
                    <form className={this.state.class} onSubmit={this.handleSearchSubmit}>
                        <input onChange={this.handleSearchInput} placeholder="Search..." type="text"></input>
                    </form>
                    <button onClick={this.showSearch} className="search__mobile-search"><span className="fa fa-search"></span></button>
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