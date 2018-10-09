import React, { Component } from 'react';
import firebase from '../../config/firebase';
import Preloader from '../Preloader/preloader';
import axios from 'axios';
import './adminpanel.css';

class Adminpanel extends Component {
    constructor() {
        super();
        this.state = {
            loaded: false,
            activeElement: null,
            users: null,
            userClicked: null,
            userNick: null,
            userAvatar: null,
            userDescription: '',
            userEmail: null,
            userAdmin: false,
            userImg: null,
            //--------------
            videos: null,
            videoClicked: null,
            videoTitle: '',
            videoMiniature: null,
            videoImg: null,
            videoDescription: '',
            clickedVideoId: null
        }
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', snapshot => {
                    snapshot.forEach(childSnap => {
                        if (childSnap.val().adminAccess === false) {
                            document.location.href = '/';
                        } else {
                            this.setState({loaded: true});
                        }
                    });
                });
                firebase.database().ref('users').once('value').then((snapshot) => {
                    let items = snapshot.val();
                    let users = [];
                    for (let item in items) {
                        users.push({
                            avatar: items[item].avatar,
                            email: items[item].email
                        });
                    }
                    this.setState({users: users});
                });
                firebase.database().ref('videos').once('value').then(snapshot => {
                    let items = snapshot.val();
                    let videos = [];
                    for (let item in items) {
                        videos.push({
                            miniature: items[item].miniature,
                            title: items[item].title,
                            uploadDate: items[item].uploadDate,
                            duration: items[item].duration,
                            author: items[item].author,
                            description: items[item].description,
                            id: items[item].id
                        });
                    }
                    this.setState({videos: videos});
                });
            } else {
                document.location.href = '/';
            }
        });
    }
    handleUsersMenuClick = (e) => {
        this.setState({activeElement: e.target.name});
        let btns = document.querySelectorAll('.admin-menu__btn');
        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
        e.target.classList.add('active');
    }
    handleUserClick = (email) => {
        this.setState({userClicked: 'clicked'});
        firebase.database().ref('users').orderByChild('email').equalTo(email).on('value', snapshot => {
            snapshot.forEach(childSnap => {
                let user = childSnap.val();
                this.setState({
                    userNick: user.nick,
                    userAvatar: user.avatar,
                    userDescription: user.description,
                    userEmail: user.email,
                    userAdmin: user.adminAccess
                });
            });
        });
    }
    changeUserMiniature = (e) => {
        const file = e.target.files[0];
        this.setState({
            userImg: file,
            userAvatar: window.URL.createObjectURL(file)
        });
    }
    changeUserDescription = (e) => {
        this.setState({
            userDescription: e.target.value
        });
    }
    changeUserAdmin = (e) => {
        this.setState({userAdmin: !this.state.userAdmin});
    }
    saveUserChanges = () => {
        if (this.state.userImg) {
            let newFile = new File([this.state.userImg], this.state.userEmail, {type: 'image/png'});
            firebase.storage().ref().child('avatars/'+newFile.name).put(newFile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then(url => {
                    firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).once('child_added', snapshot => {
                        snapshot.ref.update({
                            avatar: url
                        });
                    });
                });
            });
        }
        firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).once('child_added', snapshot => {
            snapshot.ref.update({
                description: this.state.userDescription,
                adminAccess: this.state.userAdmin
            });
        });
        alert('Changes saved!');
    }
    handleVideoClick(title, miniature, description, id) {
        this.setState({
            videoClicked: 'clicked',
            videoTitle: title,
            videoMiniature: miniature,
            videoDescription: description,
            clickedVideoId: id
        });
    }
    changeVideoMiniature = (e) => {
        const file = e.target.files[0];
        this.setState({
            videoImg: file,
            videoMiniature: window.URL.createObjectURL(file)
        });
    }
    changeVideoInfo = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }
    removeVideo = () => {
        const confirm = window.confirm('Are you really want delete this video?');
        if (confirm === true) {
            axios.post('/api/remove-video', {
                id: this.state.clickedVideoId
            }).then(resp => {
                    if (resp.data === 'success') {
                        firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
                            snapshot.ref.remove();
                        }).then(() => {
                            firebase.storage().ref('miniatures').child(this.state.clickedVideoId.substring(0, this.state.clickedVideoId.lastIndexOf('.'))).delete().then(() => {
                                alert('Video has been deleted!');
                            });
                        })
                    }
            })
        }
    }
    saveVideoChanges = () => {
        if (this.state.videoImg) {
            let newName = this.state.clickedVideoId.substring(0, this.state.clickedVideoId.lastIndexOf('.'));
            let blob = this.state.videoImg.slice(0, -1, 'image/png');
            let newFile = new File([blob], newName, {type: 'image/png'});
            firebase.storage().ref().child('miniatures/'+newFile.name).put(newFile);
        }
        firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
            snapshot.ref.update({
                title: this.state.videoTitle,
                description: this.state.videoDescription
            });
        });
        alert('Changes saved!');
    }
    render() {
        return (
            <div>
                {
                    this.state.loaded ? (
                        <div className="admin-center">
                            <div className="admin-panel">
                                <div className="admin-menu">
                                    <ul>
                                        <li>
                                            <button className='admin-menu__btn' name="users" onClick={this.handleUsersMenuClick}>Users</button>
                                        </li>
                                        <li>
                                            <button className='admin-menu__btn' name="videos" onClick={this.handleUsersMenuClick}>Videos</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="admin-main">
                                    <div className={"admin-users "+this.state.activeElement}>
                                        <div className="users-list">
                                        {
                                            this.state.users ? (
                                                this.state.users.map((item) => {
                                                    return (
                                                        <button key={item.email} onClick={() => this.handleUserClick(item.email)}>
                                                            <img width="80px" height="80px" alt="" src={item.avatar}></img>
                                                            <p>{item.email}</p>
                                                        </button>
                                                    )
                                                })
                                            ) : (
                                                ''
                                            )
                                        }
                                        </div>
                                        <div className={"users-main "+this.state.userClicked}>
                                            <div className="users-main__info">
                                                <div className="user-main__info__group">
                                                    <p>Nick: {this.state.userNick}</p>
                                                </div>
                                                <div className="user-main__info__group">
                                                    <img alt="" width="128px" height="128px" src={this.state.userAvatar}></img>
                                                    <input onChange={this.changeUserMiniature} accept="image/*" type="file"></input>
                                                </div>
                                            </div>
                                            <div className="users-main__description">
                                                <textarea onChange={this.changeUserDescription} value={this.state.userDescription}></textarea>
                                            </div>
                                            <div className="users-main__options">
                                                <button onClick={this.saveUserChanges} className="button button-primary">Save changes</button>
                                                <input onChange={this.changeUserAdmin} type="checkbox" name="admin" checked={this.state.userAdmin}></input>
                                                <label htmlFor="admin">Admin</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"admin-videos "+this.state.activeElement}>
                                        <div className="videos-list">
                                        {
                                            this.state.videos ? (
                                                this.state.videos.map((item) => {
                                                    return (
                                                        <a key={item.id} onClick={() => this.handleVideoClick(item.title, item.miniature, item.description, item.id)} className="video">
                                                            <span className="overlay">
                                                                <div className="video__length">
                                                                    <p className="length">{item.length}</p>
                                                                </div>
                                                                <img src={item.miniature} alt=""></img>
                                                                <h3>{item.title}</h3>
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
                                        <div className={"videos-main "+this.state.videoClicked}>
                                            <div className="videos-main__group">
                                                <img alt="" width="164px" height="164px" src={this.state.videoMiniature}></img>
                                                <input onChange={this.changeVideoMiniature} type="file" accept="image/*"></input>
                                            </div>
                                            <div className="videos-main__group">
                                                <input name="videoTitle" onChange={this.changeVideoInfo} type="text" value={this.state.videoTitle}></input>
                                                <textarea name="videoDescription" onChange={this.changeVideoInfo} value={this.state.videoDescription}></textarea>
                                            </div>
                                            <div className="videos-main__group">
                                                <button onClick={this.removeVideo} className="button button-primary">Delete video</button>
                                                <button onClick={this.saveVideoChanges} className="button button-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="admin-center">
                            <Preloader />
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Adminpanel;