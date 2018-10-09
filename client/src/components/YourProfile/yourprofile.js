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
            userImgLink: null,
            userEmail: null,
            userDescription: null,
            userDescriptionSettings: null,
            userVideos: null,
            editTitle: '',
            shortedTitle: null,
            editDescription: '',
            editMiniatureLink: null,
            editMiniature: null,
            clickedVideoId: null,
            active: '',
            submitted: false,
            submittedEditVideo: false,
            submittedMessage: '',
            oldPassword: null,
            newPassword: null,
            settingsMessageMiniature: '',
            settingsMessageDescription: '',
            settingsMessagePassword: '',
            settingsMessageDeleteAccount: '',
            deleteAccountPassword: null,
            removingAccountProcess: '',
        }
    }
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                firebase.database().ref('users').orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
                    snapshot.forEach(childSnap => {
                        this.setState({
                            userImgLink: childSnap.val().avatar,
                            userImgLinkProfile: childSnap.val().avatar,
                            userEmail: childSnap.val().email,
                            userDescription: childSnap.val().description
                        });
                    });
                });
                firebase.database().ref('videos').orderByChild('author').equalTo(user.email).on('value', (snapshot) => {
                    let newState = [];
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
                    this.setState({userVideos: newState});
                });
            }
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
        if (!this.state.submittedEditVideo) {
            if (this.state.clickedVideoId) {
                this.setState({submittedEditVideo: true});
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
                             this.setState({submittedEditVideo: false, submittedMessage: 'Video has been edited!'});
                        });
                    });
                } else {
                    firebase.database().ref('videos').orderByChild('id').equalTo(this.state.clickedVideoId).once('child_added', (snapshot) => {
                        snapshot.ref.update({
                            title: this.state.editTitle,
                            description: this.state.editDescription
                         }).then(() => {
                            this.setState({submittedEditVideo: false, submittedMessage: 'Video has been edited!'});
                         });
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
    changeMiniature = (e) => {
        const file = e.target.files[0];
        this.setState({
            userImg: file,
            userImgLink: window.URL.createObjectURL(file)
        });
    }
    changeDescription = (e) => {
        this.setState({
            userDescriptionSettings: e.target.value,
            userDescription: e.target.value
        });
    }
    saveSettings = () => {
        if (this.state.userImg) {
            let newFile = new File([this.state.userImg], this.state.userEmail, {type: 'image/png'});
            firebase.storage().ref().child('avatars/'+newFile.name).put(newFile).then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {
                    firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).once('child_added', (snapshot) => {
                        snapshot.ref.update({
                            avatar: url
                        });
                        this.setState({
                            settingsMessageMiniature: 'Avatar has beed changed!'
                        });
                    });  
                });
            });
        }
        if (this.state.userDescriptionSettings) {
            firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).once('child_added', (snapshot) => {
                snapshot.ref.update({
                    description: this.state.userDescriptionSettings
                });
                this.setState({
                    settingsMessageDescription: 'Description has beed changed!'
                });
            });
        }
        if (this.state.oldPassword && this.state.newPassword) {
            firebase.auth().onAuthStateChanged(user => {
                let credential = firebase.auth.EmailAuthProvider.credential(
                    this.state.userEmail,
                    this.state.oldPassword
                );
                user.reauthenticateWithCredential(credential).then(() => {
                    user.updatePassword(this.state.newPassword).then(() => {
                        this.setState({
                            settingsMessagePassword: 'Password has been changed!'
                        });
                    }).catch(() => {
                        this.setState({
                            settingsMessagePassword: 'New password should have at least 6 characters!'
                        });
                    });
                }).catch(() => {
                    this.setState({
                        settingsMessagePassword: 'Old password is wrong!'
                    });
                });
            });
        }
    }
    deleteAccount = () => {
        const confirm = window.confirm('Are you really want delete your account?');
        if (confirm === true) {
            if (this.state.deleteAccountPassword) {
                let credential = firebase.auth.EmailAuthProvider.credential(
                    this.state.userEmail,
                    this.state.deleteAccountPassword
                );
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        user.reauthenticateWithCredential(credential).then(() => {
                            this.setState({removingAccountProcess: 'process'});
                            let videosArray = [];
                            //removing users videos
                            firebase.database().ref('videos').orderByChild('author').equalTo(this.state.userEmail).on('value', (snapshot) => {
                                let videos = snapshot.val();
                                for (let item in videos) {
                                    videosArray.push(videos[item].id);
                                }
                            });
                            for (let i = 0; i < videosArray.length; i++) {
                                axios.post('/api/remove-video', {
                                    id: videosArray[i]
                                });
                                firebase.database().ref('videos').orderByChild('id').equalTo(videosArray[i]).once('child_added', (snapshot) => {
                                    snapshot.ref.remove();
                                });
                                firebase.storage().ref('miniatures').child(videosArray[i].substring(0, videosArray[i].lastIndexOf('.'))).delete();
                            }
                            //removing likes from videos
                            firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).on('value', (snapshot) => {
                                let likes = '';
                                snapshot.forEach(item => {
                                    likes = item.val().likes;
                                });
                                for (let i = 0; i < likes.length; i++) {
                                    if (likes[i] !== 'zero') {
                                        firebase.database().ref('videos').orderByChild('id').equalTo(likes[i]).once('child_added', (snapshot) => {
                                            let videoLikes = snapshot.val().likes;
                                            snapshot.ref.update({
                                                likes: videoLikes - 1
                                            });
                                        });
                                    }
                                }
                            });
                            //removing dislikes from videos
                            firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).on('value', (snapshot) => {
                                let dislikes = '';
                                snapshot.forEach(item => {
                                    dislikes = item.val().dislikes;
                                });
                                for (let i = 0; i < dislikes.length; i++) {
                                    if (dislikes[i] !== 'zero') {
                                        firebase.database().ref('videos').orderByChild('id').equalTo(dislikes[i]).once('child_added', (snapshot) => {
                                            let videoDislikes = snapshot.val().dislikes;
                                            snapshot.ref.update({
                                                dislikes: videoDislikes - 1
                                            });
                                        });
                                    }
                                }
                            });
                            firebase.database().ref('users').orderByChild('email').equalTo(this.state.userEmail).once('child_added', (snapshot) => {
                                snapshot.ref.remove();
                            });
                            firebase.storage().ref('avatars').child(this.state.userEmail).getDownloadURL().then(() => {
                                firebase.storage().ref('avatars').child(this.state.userEmail).delete();
                            }).catch(() => {
                                '';
                            });
                            user.delete();
                            this.setState({removingAccountProcess: ''});
                        }).catch((err) => {
                            this.setState({
                                settingsMessageDeleteAccount: 'Wrong password!'
                            });
                        });
                    }
                });
            }
        }
    }
    render() {
        return (
            <div className="head yourprofile">
            <div className={"account-removing "+this.state.removingAccountProcess}>
                <p>Deleting account...</p>
            </div>
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
                            <img width="128px" height="128px" src={this.state.userImgLinkProfile} alt=""></img>
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
                                        <button onClick={() => this.handleSubmitEdit()} className="button button-primary">Edit video</button>
                                    </div>
                                    {
                                        this.state.submittedEditVideo ? (
                                            <Preloader />
                                        ) : (
                                            <p>{this.state.submittedMessage}</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={"yourprofile__content-settings "+this.state.activeElement}>
                            <div className="content-settings__option">
                                <p className="settings__option__title">Avatar</p>
                                <img width="128px" height="128px" src={this.state.userImgLink} alt=""></img>
                                <input onChange={this.changeMiniature} type="file" accept="image/*"></input>
                                <p className="option__message">{this.state.settingsMessageMiniature}</p>
                            </div>
                            <div className="content-settings__option">
                                <p className="settings__option__title">Profile description</p>
                                <textarea onChange={this.changeDescription} value={this.state.userDescription ? this.state.userDescription : ''} placeholder="Description"></textarea>
                                <p className="option__message">{this.state.settingsMessageDescription}</p>
                            </div>
                            <div className="content-settings__option">
                                <p className="settings__option__title">Change password</p>
                                <input onChange={this.handleInput} name="oldPassword" type="password" placeholder="Old password"></input>
                                <input onChange={this.handleInput} name="newPassword" type="password" placeholder="New password"></input>
                                <p className="option__message">{this.state.settingsMessagePassword}</p>
                            </div>
                            <div className="content-settings__option">
                                <p className="settings__option__title">Delete account</p>
                                <input onChange={this.handleInput} name="deleteAccountPassword" type="password" placeholder="Password"></input>
                                <button onClick={this.deleteAccount} className="button button-primary">Delete</button>
                                <p className="option__message">{this.state.settingsMessageDeleteAccount}</p>
                            </div>
                            <div className="content-settings__option">
                                <p className="settings__option__title">Save</p>
                                <button onClick={this.saveSettings} className="button button-primary">Save settings</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Yourprofile;