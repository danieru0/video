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
            videoViews: 0,
            videoLikes: 0,
            videoDislikes: 0,
            userLikes: null,
            userDislikes: null,
            userLiked: false,
            userDisliked: false,
            authorAvatar: null
        }
    }
    componentDidMount() {
        const {id} = this.props.match.params;
        firebase.database().ref('videos').orderByChild('id').equalTo(id).on('value', (snapshot) => {
            snapshot.forEach((childSnap) => {
                let videoData = childSnap.val();
                let author = videoData.author.split("@")[0];
                this.setState({
                    videoTitle: videoData.title,
                    videoDescription: videoData.description,
                    videoAuthor: author,
                    videoViews: videoData.views,
                    videoLikes: videoData.likes,
                    videoDislikes: videoData.dislikes
                }, () => {
                    this.setState({
                        videoViews: this.state.videoViews + 1
                    });
                    firebase.database().ref('users').orderByChild('email').equalTo(videoData.author).on('value', (snapshot) => {
                        snapshot.forEach((childSnap) => {
                            console.log(childSnap.val());
                            this.setState({
                                authorAvatar: childSnap.val().avatar
                            });
                        });
                    });
                });
            });
        })
        this.setState({id: id}, () => {
            axios.post('/api/get-video', {
                id: this.state.id
            }).then((resp) => {
                this.setState({
                    videoURL: resp
                });
                firebase.database().ref('videos').orderByChild('id').equalTo(id).once('child_added', (snapshot) => {
                    snapshot.ref.update({views: this.state.videoViews});
                });
            });
        });
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                snapshot.forEach((childSnap) => {
                    this.setState({
                        userLikes: childSnap.val().likes,
                        userDislikes: childSnap.val().dislikes
                    }, () => {
                        let ifLiked = false;
                        let ifDisliked = false;
                        this.state.userLikes.forEach(element => {
                            if (element === this.state.id) {
                                ifLiked = true;
                            }
                        });
                        this.state.userDislikes.forEach(element => {
                            if (element === this.state.id) {
                                ifDisliked = true;
                            }
                        });
                        this.setState({
                            userLiked: ifLiked,
                            userDisliked: ifDisliked
                        });
                    });
                });
            });
        });
    }
    handleClick = (type) => {
        firebase.auth().onAuthStateChanged((user) => {
            let ifLiked = this.state.userLiked;
            let ifDisliked = this.state.userDisliked;
            switch (type) {
                case 'like':
                    if (!ifLiked) {
                        if (!ifDisliked) {
                            firebase.database().ref('users').orderByChild('email').equalTo(user.email).once('child_added', (snapshot) => {
                                this.setState({
                                    userLikes: [...this.state.userLikes, this.state.id],
                                    videoLikes: this.state.videoLikes + 1
                                }, () => {
                                    snapshot.ref.update({likes: this.state.userLikes});
                                });
                            });
                        }
                    } else {
                        firebase.database().ref('users').orderByChild('email').equalTo(user.email).once('child_added', (snapshot) => {
                            let video = this.state.id;
                            function isEqual(value) {
                                return value !== video;
                            }
                            this.setState({
                                userLikes: this.state.userLikes.filter(isEqual),
                                videoLikes: this.state.videoLikes - 1,
                                userLiked: false
                            }, () => {
                                snapshot.ref.update({likes: this.state.userLikes});
                            });
                        });
                    }
                    break;
                case 'dislike':
                    if (!ifDisliked) {
                        if (!ifLiked) {
                            firebase.database().ref('users').orderByChild('email').equalTo(user.email).once('child_added', (snapshot) => {
                                this.setState({
                                    userDislikes: [...this.state.userDislikes, this.state.id],
                                    videoDislikes: this.state.videoDislikes + 1
                                }, () => {
                                    snapshot.ref.update({dislikes: this.state.userDislikes});
                                });
                            });
                        }
                    } else {
                        firebase.database().ref('users').orderByChild('email').equalTo(user.email).once('child_added', (snapshot) => {
                            let video = this.state.id;
                            function isEqual(value) {
                                return value !== video;
                            }
                            this.setState({
                                userDislikes: this.state.userDislikes.filter(isEqual),
                                videoDislikes: this.state.videoDislikes - 1,
                                userDisliked: false
                            }, () => {
                                snapshot.ref.update({dislikes: this.state.userDislikes});
                            });
                        });
                    }
                    break;
                default:
                    break;
            }
            firebase.database().ref('videos').orderByChild('id').equalTo(this.state.id).once('child_added', (snapshot) => {
                snapshot.ref.update({
                    likes: this.state.videoLikes,
                    dislikes: this.state.videoDislikes
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
                    <div className="video__likes">
                        <button onClick={() => this.handleClick('like')}>
                            <span className={this.state.userLiked ? "fa fa-thumbs-up clicked-like" : "fa fa-thumbs-up"}></span>
                            <span className="likes__amount">{this.state.videoLikes}</span>
                        </button>
                        <button onClick={() => this.handleClick('dislike')}>
                            <span className={this.state.userDisliked ? "fa fa-thumbs-down clicked-dislike" : "fa fa-thumbs-down"}></span>
                            <span className="likes__amount">{this.state.videoDislikes}</span>
                        </button>
                    </div>
                    <span className="line"></span>
                    <div className="info__author">
                        <img alt="" width="48px" height="48px" src={this.state.authorAvatar}></img>
                        <p className="author__nick">{this.state.videoAuthor}</p>
                    </div>
                    <p className="info__description">{this.state.videoDescription}</p>
                </div>
            </div>
        )
    }
}

export default Watch;