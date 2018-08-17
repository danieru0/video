import React, { Component } from 'react';
import './addvideo.css';

class Add extends Component {
    constructor() {
        super();
        this.state = {
            video: null,
            videoTitle: null,
            videoDescription: null,
            formSubmitted: null
        }
    }
    getVideo = (e) => {
        let fileFormat = e.target.files[0].type.split('/')[1];
        //if (fileFormat === 'mp4') {
            this.setState({
                video: e.target.files[0],
            });
        /*} else {
            alert('Wrong file type! Only mp4');
            e.target.value = null;
        }*/
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.video) {
            let formData = new FormData();
            formData.append('video', this.state.video);
            fetch('/api/add-video', {
                method: 'post',
                body: formData
            }).then((res) => {
                console.log(res);
            });
        } else {
            alert('Video is required!');
        }
    }
    render() {
        return (
            <div className="center add-video">
                <h2>Add video</h2>
                <form className="form-add" method="post" onSubmit={this.handleSubmit}>
                    <div className="inputs-group video-preview">
                        <video width="320px" height="240px" src={this.state.videoLink} controls>
                        </video>
                        <input onChange={this.getVideo} type="file" accept="video/*"></input>
                    </div>
                    <div className="inputs-group video-settings">
                        <input placeholder="Video title" className="video-title" type="text"></input>
                        <textarea placeholder="Video description"></textarea>
                    </div>
                    <button className="button button-primary" type="submit">Add video</button>
                </form>
            </div>
        )
    }
}

export default Add;