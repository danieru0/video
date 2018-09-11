import React, { Component } from 'react';
import firebase from '../../config/firebase';
import axios from 'axios';
import './yourprofile.css';
import Preloader from '../Preloader/preloader';

class Yourprofile extends Component {
    constructor() {
        super();
        this.state = {
            activeElement: 'profile-active',
            userImg: null,
            userEmail: null,
            userDescription: null,
            userVideos: null,
            editTitle: '',
            shortedTitle: null,
            editDescription: '',
            editMiniatureLink: null,
            editMiniature: null,
            clickedVideoId: null,
            active: '',
            submitted: false,
            submittedMessage: ''
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            let newState = [];
            firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                snapshot.forEach(childSnap => {
                    this.setState({
                        userImg: childSnap.val().avatar,
                        userEmail: childSnap.val().email,
                        userDescription: childSnap.val().description
                    });
                });
            });
            firebase.database().ref('videos').orderByChild('author').equalTo(user.email).on('value', (snapshot) => {
                let videos = snapshot.val();
                let shortedTitle = '';
                for (let item in videos) {
                    if (videos[item].title.length > 55) {
                        shortedTitle = videos[item].title.substring(0, 55)+'...';
                    }
                    newState.push({
                        title: videos[item].title,
                        shortedTitle: shortedTitle,
                        miniature: videos[item].miniature,
                        duration: videos[item].duration,
                        id: videos[item].id,
                        author: videos[item].author.split("@")[0],
                        views: videos[item].views,
                        uploadDate: videos[item].uploadDate,
                        description: videos[item].description
                    });
                }
            });
            this.setState({userVideos: newState});
        });
    }
    handleClick = (clicked, element) => {
        this.setState({
            activeElement: clicked
        });
        let btns = document.querySelectorAll('.yourprofile__menu__button');
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('button-active');
        }
        element.target.classList.add('button-active');
    }
    handleVideoClick = (title, description, miniature, id) => {
        this.setState({
            active: 'active',
            editTitle: title,
            editDescription: description,
            editMiniatureLink: miniature,
            clickedVideoId: id
        });
    }
    handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }
    getMiniature = (e) => {
        const file = e.target.files[0];
        this.setState({
            editMiniature: file,
            editMiniatureLink: window.URL.createObjectURL(file)
        });
    }
    handleSubmitEdit = () => {
        if (!this.state.submitted) {
            if (this.state.clickedVideoId) {
                this.setState({submitted: true});
                if (this.state.editMiniature) {
                    let newName = this.state.clickedVideoId.substring(0, this.state.clickedVideoId.lastIndexOf('.'));
                    let blob = this.state.editMiniature.slice(0, -1, 'image/png');
                    let newFile = new File([blob], newName, {type: 'image/png'});
                    firebase.storage().ref().child('miniatures/'+newFile.name).put(newFile).then(() => {
                        firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
                            snapshot.ref.update({
                                title: this.state.editTitle,
                                description: this.state.editDescription
                             });
                             this.setState({submitted: false, submittedMessage: 'Video has been edited!'});
                        });
                    });
                } else {
                    firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
                        snapshot.ref.update({
                            title: this.state.editTitle,
                            description: this.state.editDescription
                         });
                         this.setState({submitted: false, submittedMessage: 'Video has been edited!'});
                    });
                }
            }
        }
    }
    handleSubmitRemove = () => {
        const confirm = window.confirm('Are you really want delete your video?');
        if (confirm === true) {
            this.setState({submitted: true});
            axios.post('/api/remove-video', {
                id: this.state.clickedVideoId
            }).then(resp => {
                    if (resp.data === 'success') {
                        firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
                            snapshot.ref.remove();
                        }).then(() => {
                            firebase.storage().ref('miniatures').child(this.state.clickedVideoId.substring(0, this.state.clickedVideoId.lastIndexOf('.'))).delete().then(() => {
                                this.setState({submitted: false, submittedMessage: 'Video has beed removed!'});
                            });
                        })
                    }
            })
        }
    }
    render() {
        return (
            <div className="head yourprofile">
                <div className="yourprofile__main">
                    <div className="yourprofile__menu">
                        <ul>
                            <li><button className="yourprofile__menu__button button-active" onClick={(event) => this.handleClick('profile-active', event)}>Profile</button></li>
                            <li><button className="yourprofile__menu__button" onClick={(event) => this.handleClick('videos-active', event)}>Videos</button></li>
                            <li><button className="yourprofile__menu__button" onClick={(event) => this.handleClick('settings-active', event)}>Settings</button></li>
                        </ul>
                    </div>
                    <div className="yourprofile__content">
                        <div className={"yourprofile__content-profile "+this.state.activeElement}>
                            <img width="128px" height="128px" src={this.state.userImg} alt=""></img>
                            <p className="profile__username">{this.state.userEmail}</p>
                            <p className="profile__description">{this.state.userDescription}</p>
                        </div>
                        <div className={"yourprofile__content-videos "+this.state.activeElement}>
                            <div className="content-videos__videos">
                                {
                                    this.state.userVideos ? (
                                        this.state.userVideos.map((item) => {
                                            return (
                                                <a key={item.id} onClick={() => this.handleVideoClick(item.title, item.description, item.miniature, item.id)} className="video">
                                                    <span className="overlay">
                                                        <div className="video__length">
                                                            <p className="length">{item.duration}</p>
                                                        </div>
                                                        <img src={item.miniature} alt=""></img>
                                                        <h3>{item.shortedTitle === item.title.substring(0, 55)+'...' ? item.shortedTitle : item.title}</h3>
                                                        <div className="video__info">
                                                            <p>{item.author}</p>
                                                            <p>{item.views} views</p>
                                                            <p>{item.uploadDate}</p>
                                                            <p className="hidden">{item.description}</p>
                                                        </div>
                                                    </span>
                                                </a>
                                            )
                                        })
                                    ) : (
                                        ''
                                    )
                                }
                            </div>
                            <div className={"content-videos__edit "+this.state.active}>
                                <div className="vidoes__edit__info">
                                    <input name="editTitle" onChange={this.handleInput} value={this.state.editTitle} placeholder="Video title" type="text"></input>
                                    <textarea name="editDescription" onChange={this.handleInput} value={this.state.editDescription} placeholder="Video description"></textarea>
                                </div>
                                <div className="videos__edit__miniature">
                                    <img alt="" src={this.state.editMiniatureLink} width="320px" height="240px"></img>
                                    <input onChange={this.getMiniature} name="miniature" type="file" accept="image/*"></input>
                                </div>
                                <div className="videos__edit__buttons">
                                    <div>
                                        <button onClick={this.handleSubmitRemove} className="button button-primary">Remove video</button>
                                        <button onClick={this.handleSubmitEdit} className="button button-primary">Edit video</button>
                                    </div>
                                    {
                                        this.state.submitted ? (
                                            <Preloader />
                                        ) : (
                                            <p>{this.state.submittedMessage}</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Yourprofile;