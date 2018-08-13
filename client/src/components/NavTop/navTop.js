import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
        const {name} = this.props;
        return (
            <ul>
                <li>
                    <Link to="/profile">
                        {this.login(name)}
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
        }
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
    render() {
        return (
            <nav className="topNav">
                {   
                    this.state.user ? (
                        <User name={this.state.user.email}/>
                    ) : (
                        <Guest />
                    )
                }
            </nav>
        )
    }
}

export default NavTop;