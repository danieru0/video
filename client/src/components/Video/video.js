import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './video.css';

class Video extends Component {
    render() {
        const { title, length, image, id } = this.props;
        return (
            <Link to={"/watch/"+id}>
                <button className="video">
                    <span className="overlay">
                        <div className="video__length">
                            <p className="length">{length}</p>
                        </div>
                        <img src={image} alt=""></img>
                        <h3>{title}</h3>
                    </span>
                </button>
            </Link>
        )
    }
}

export default Video;