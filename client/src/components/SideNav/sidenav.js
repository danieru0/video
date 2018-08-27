import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './sidenav.css';

class SideNav extends Component {
    constructor() {
        super();
        this.state = {
            menu: false,
            class: null
        };
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
                <button onClick={this.showMenu} className={"hamburger "+this.state.class}><span className="fa fa-bars"></span></button>
                <Link to="/">
                    <span className={"logo "+this.state.class}>Home</span>
                </Link>
                <div className={"menu " + this.state.class}>
                    <span className="line"></span>
                    <ul className="sidenav__list">
                        <li className="sidenav__item">
                            <Link to="/liked">
                                <span className="fa fa-thumbs-up"></span>Liked videos
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default SideNav;