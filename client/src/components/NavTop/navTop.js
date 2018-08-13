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
    render() {
        return (
            <ul>
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
        //const { user } = this.props;
        return (
            <nav className="topNav">
                {   
                    this.state.user ? (
                        <User />
                    ) : (
                        <Guest />
                    )
                }
            </nav>
        )
    }
}

export default NavTop;