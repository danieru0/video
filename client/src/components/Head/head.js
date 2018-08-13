import React, { Component } from 'react';
import './head.css';
import Video from '../Video/video';

class Head extends Component {
    constructor() {
        super();
        this.state = {
            image: []
        };
    }
    /*componentDidMount() {
        fetch('api/miniatures')
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({
                    image: res
                });
            });
    }*/
    render() {
        return (
            <main className="head">
                <div className="wrapper">
                    <Video title="nmm" length="21:37" image="http://www.grhnarew.fora.pl/images/galleries/3876491244c9e14053175d-428229-wm.jpg"/>
                    <Video title="xdwefwefwewefwfwewefewfwefwewefwes" length="2:57" image="http://www.grhnarew.fora.pl/images/galleries/3876491244c9e14053175d-428229-wm.jpg"/>
                    <Video title="siemaaa" length="4:20" image="http://www.grhnarew.fora.pl/images/galleries/3876491244c9e14053175d-428229-wm.jpg"/>
                </div>
            </main>
        )
    }
}

export default Head;