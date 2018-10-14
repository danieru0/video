import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../config/firebase';
import './sidenav.css';

class SideNav extends Component {
    constructor() {
        super();
        this.state = {
            menu: false,
            class: '',
            user: null
        };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({user: user});
        })
    }
    showMenu = () => {
        if (this.state.menu === false) {
            this.setState({
                menu: true,
                class: "shown"
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
            <nav className="sidenav">
                <div className={"sidenav__buttons " + this.state.class}>
                <button onClick={this.showMenu} className={"hamburger "+this.state.class}><span className="fa fa-bars"></span></button>
                <Link to="/">
                    <span className={"logo "+this.state.class}>Home</span>
                </Link>
                </div>
                <div className={"menu " + this.state.class}>
                    <span className="line"></span>
                    <ul className="sidenav__list">
                        <li className="sidenav__item">
                            {
                                this.state.user ? (
                                    <Link to="/liked">
                                        <span className="fa fa-thumbs-up"></span>Liked videos
                                    </Link>
                                ) : (
                                    ''
                                )
                            }
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default SideNav;