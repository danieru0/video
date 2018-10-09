import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './video.css';

class Video extends Component {
    render() {
        let { title, length, image, id, author, views, uploadDate } = this.props;
        let titleCut;
        if (title.length > 55) {
            titleCut = title.substring(0, 55)+'...';
        }
        return (
            <Link title={title} className="video" to={"/watch/"+id}>
                <span className="overlay">
                    <div className="video__length">
                        <p className="length">{length}</p>
                     </div>
                    <img src={image} alt=""></img>
                    <h3>{titleCut ? titleCut : title}</h3>
                    <div className="video__info">
                        <p>{author}</p>
                        <p>{views} views</p>
                        <p>{uploadDate}</p>
                    </div>
                </span>
            </Link>
        )
    }
}

export default Video;