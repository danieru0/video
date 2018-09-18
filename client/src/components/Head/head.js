import React, { Component } from 'react';
import './head.css';
import firebase from '../../config/firebase';
import Video from '../Video/video';

class Head extends Component {
    constructor() {
        super();
        this.state = {
            videos: null
        };
    }
    componentDidMount() {
        this._mounted = true;
        firebase.database().ref('videos').once('value').then((snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    title: items[item].title,
                    miniature: items[item].miniature,
                    duration: items[item].duration,
                    id: items[item].id,
                    author: items[item].author.split("@")[0],
                    views: items[item].views,
                    uploadDate: items[item].uploadDate
                });
            }
            if (this._mounted) {
                this.setState({
                    videos: newState
                }) 
            }
        });
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    render() {
        return (
            <main className="head">
                <div className="wrapper">
                    {   
                        this.state.videos ? (
                            this.state.videos.map((item) => {
                                return (
                                    <Video key={item.id} uploadDate={item.uploadDate} views={item.views} author={item.author} length={item.duration} title={item.title} image={item.miniature} id={item.id} />
                                )
                            })
                        ) : (
                            ''
                        )
                    }
                </div>
            </main>
        )
    }
}

export default Head;