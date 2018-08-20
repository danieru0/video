import React, { Component } from 'react';
import axios from 'axios';
import firebase from '../../config/firebase';
import './watch.css';

class Watch extends Component {
    constructor() {
        super();
        this.state = {
            id: null,
            videoURL: null,
            videoTitle: null,
            videoDescription: null,
            videoAuthor: null,
            videoViews: 0
        }
    }
    componentDidMount() {
        const {id} = this.props.match.params;
        firebase.database().ref('videos').orderByChild('id').equalTo(id).on('value', (snapshot) => {
            snapshot.forEach((childSnap) => {
                let videoData = childSnap.val();
                this.setState({
                    videoTitle: videoData.title,
                    videoDescription: videoData.description,
                    videoAuthor: videoData.author,
                    videoViews: videoData.views
                }, () => {
                    this.setState({
                        videoViews: this.state.videoViews + 1
                    });
                });
            });
        });
        firebase.database().ref('videos').orderByChild('id').equalTo(id).once('child_added', (snapshot) => {
            snapshot.ref.update({views: this.state.videoViews});
        });
        this.setState({id: id}, () => {
            axios.post('/api/get-video', {
                id: this.state.id
            }).then((resp) => {
                this.setState({
                    videoURL: resp
                });
            });
        });
    }
    render() {
        return (
            <div>
                <div className="watch-video">
                    <video id="video" src={this.state.videoURL ? this.state.videoURL.data : ''} width="1280px" height="720px" controls></video>
                </div>
                <div className="watch-video__info">
                    <p className="info__title">{this.state.videoTitle}</p>
                    <p className="info__views">{this.state.videoViews} views</p>
                    <span className="line"></span>
                    <div className="info__author">
                        <img alt="" width="48px" height="48px" src="https://image.flaticon.com/icons/svg/149/149071.svg"></img>
                        <p className="author__nick">{this.state.videoAuthor}</p>
                    </div>
                    <p className="info__description">{this.state.videoDescription}</p>
                </div>
            </div>
        )
    }
}

export default Watch;