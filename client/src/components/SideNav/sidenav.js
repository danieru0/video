import React, { Component } from 'react';
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
                class: null
            });
        }
    }
    render() {
        return (
            <nav className="sidenav">
                <button onClick={this.showMenu} className="hamburger"><span className="fa fa-bars"></span></button>
                <div className={"menu " + this.state.class}>
                    <span className="line"></span>
                </div>
            </nav>
        )
    }
}

export default SideNav;