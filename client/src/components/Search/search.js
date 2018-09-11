import React, { Component } from 'react';
import Video from '../Video/video';
import firebase from '../../config/firebase';

class Search extends Component {
    constructor() {
        super();
        this.state = {
            filteredVideos: null
        };
    }
    filterVideos = (value) => {
        let videos = [];
        firebase.database().ref('videos').once('value').then((snapshot) => {
            snapshot.forEach((childSnap) => {
                if (childSnap.val().title.toLowerCase().includes(value.toLowerCase()) || childSnap.val().author.toLowerCase().includes(value.toLowerCase())) {
                    videos.push(childSnap.val());
                }
            });
            this.setState({
                filteredVideos: videos
            });
        });
    }
    componentDidMount() {
        const {value} = this.props.match.params;
        this.filterVideos(value);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params !== this.props.match.params) {
            const {value} = nextProps.match.params;
            this.filterVideos(value);
        }
    }
    render() {
        return (
            <div className="head">
                <div className="wrapper">
                    {
                        this.state.filteredVideos ? (
                            this.state.filteredVideos.map((item) => {
                                return (
                                    <Video key={item.id} uploadDate={item.uploadDate} views={item.views} author={item.author.split("@")[0]} length={item.duration} title={item.title} image={item.miniature} id={item.id} />
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

export default Search;