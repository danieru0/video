import React, { Component } from 'react';
import './preloader.css';

class Preloader extends Component {
    render() {
        return (
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        )
    }
}

export default Preloader;