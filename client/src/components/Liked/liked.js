import React, { Component } from 'react';
import Video from '../Video/video';
import firebase from '../../config/firebase';
import './liked.css';

class Preloader extends Component {
    constructor() {
        super();
        this.state = {
            videos: null
        };
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                snapshot.forEach((childSnap) => {
                    let userLikedVideos = childSnap.val().likes;
                    let newState = [];
                    for (let i = 0; i < userLikedVideos.length; i++) {
                        firebase.database().ref('/videos').orderByChild('id').equalTo(userLikedVideos[i]).on('value', (snapshot) => {
                            let videos = snapshot.val();
                            for (let item in videos) {
                                newState.push({
                                    title: videos[item].title,
                                    miniature: videos[item].miniature,
                                    duration: videos[item].duration,
                                    id: videos[item].id
                                });
                            }
                        });
                    }
                    this.setState({
                        videos: newState
                    }, () => {
                        console.log(this.state.videos);
                    });
                });
            });
        });
    }
    render() {
        return (
            <div className="head">
                <div className="wrapper">
                    {
                        this.state.videos ? (
                            this.state.videos.map((item) => {
                                return (
                                    <Video key={item.id} length={item.duration} title={item.title} image={item.miniature} id={item.id} />
                                )
                            })
                        ) : (
                            ''
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Preloader;