import React, { Component } from 'react';
import firebase from '../../config/firebase';
import Preloader from '../Preloader/preloader';
import './addvideo.css';

class Add extends Component {
    constructor() {
        super();
        this.state = {
            video: null,
            videoLink: null,
            videoTitle: null,
            videoDescription: null,
            videoMiniature: null,
            videoMiniatureLink: null,
            formSubmitted: false,
            formResponse: null,
            file: null
        }
    }
    getVideo = (e) => {
        const name = e.target.name;
        const file = e.target.files[0];
        if (file) {
            switch(name) {
                case 'video':
                    let fileFormat = file.type.split('/')[1];
                    if (fileFormat === 'mp4') {
                        this.setState({
                            video: file,
                            videoLink: window.URL.createObjectURL(file)
                        }, () => {
                            if (!this.state.video) { //making sure that video is not null
                                this.setState({
                                    video: file
                                })
                            } 
                        });
                    } else {
                        alert('Wrong file type! Only mp4');
                        e.target.value = null;
                    }
                    break;
                case 'miniature':
                    this.setState({
                        videoMiniature: file,
                        videoMiniatureLink: window.URL.createObjectURL(file)
                    }, () => {
                        if (!this.state.videoMiniature) { //making sure that videoMiniature is not null
                            this.setState({
                                videoMiniature: file
                            })
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    } 
    getDuration = () => {
        let time = Math.floor(this.refs.video.duration);
        let hrs = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = time % 60;
        let videoDuration = '';
        if (hrs > 0) {
            videoDuration += "" + hrs + ":" + (mins < 10 ? "0" : "");
        }
        videoDuration += "" + mins + ":" + (secs < 10 ? "0" : "");
        videoDuration += "" + secs;
        return videoDuration;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.formSubmitted) {
            if (this.state.video) {
                if (!this.state.videoTitle) {
                    alert('Video title is required!');
                    return;
                }
                if (!this.state.videoMiniature) {
                    alert('Video miniature is required!');
                    return;
                }
                this.setState({
                    formSubmitted: true
                });
                let formData = new FormData();
                formData.append('video', this.state.video);
                fetch('/api/add-video', {
                    method: 'post',
                    body: formData
                }).then((res) => res.json())
                   .then((res) => {
                        let newName = res.substring(0, res.lastIndexOf('.'));
                        let blob = this.state.videoMiniature.slice(0, -1, 'image/png');
                        let newFile = new File([blob], newName, {type: 'image/png'});
                        firebase.storage().ref().child('miniatures/'+newFile.name).put(newFile).then((snapshot) => {
                            snapshot.ref.getDownloadURL().then((url) => {
                                let duration = this.getDuration();
                                let date = new Date().toISOString().slice(0, 10);
                                let newVideoFirebase = firebase.database().ref('videos/').push();
                                newVideoFirebase.set({
                                    title: this.state.videoTitle,
                                    description: this.state.videoDescription,
                                    author: firebase.auth().currentUser.email,
                                    comments: '',
                                    commentsAmount: 0,
                                    miniature: url,
                                    duration: duration,
                                    views: 0,
                                    likes: 0,
                                    dislikes: 0,
                                    uploadDate: date,
                                    id: res
                                }).then(() => {
                                    this.setState({
                                        formResponse: 'Video added!',
                                        formSubmitted: false
                                    });
                                    //window.location.href = '/';
                                }).catch((error) => {
                                    this.setState({
                                        formResponse: 'Video has not been added',
                                        formSubmitted: false
                                    });
                                });
                            });
                        });
                })
            } else {
                alert('Video is required!');
            }
        }
    }
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }
    ifSubmit = () => {
        if (this.state.formSubmitted) {
            return true;
        } else {
            return false;
        }
    }
    render() {
        return (
            <div className="center add-video">
                <h2>Add video</h2>
                <form className="form-add" method="post" onSubmit={this.handleSubmit}>
                    <div className="inputs-group video-preview">
                        <div className="video-preview__group">
                            <p className="video-text">Video:</p>
                            <video ref="video" width="320px" height="240px" src={this.state.videoLink} controls>
                            </video>
                            <input name="video" onChange={(event) => this.getVideo(event)} type="file" accept="video/*"></input>
                        </div>
                        <div className="video-preview__group">
                            <p className="video-text">Miniature:</p>
                            <img alt="" src={this.state.videoMiniatureLink} width="320px" height="240px"></img>
                            <input name="miniature" onChange={(event) => this.getVideo(event)} type="file" accept="image/*"></input>
                        </div>
                    </div>
                    <div className="inputs-group video-settings">
                        <input name="videoTitle" onChange={(event) => this.handleUserInput(event)} placeholder="Video title" className="video-title" type="text"></input>
                        <textarea name="videoDescription" onChange={(event) => this.handleUserInput(event)} placeholder="Video description"></textarea>
                        <button className="button button-primary" type="submit">Add video</button>
                    </div>
                    {
                    this.ifSubmit() ? <Preloader /> : <p className="error-message">{this.state.formResponse}</p>
                    }
                </form>
            </div>
        )
    }
}

export default Add;