import React, { Component } from 'react';
import { getPath } from '../../utils';

import './notfound.less';

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 3
    };

    this.interval = window.setInterval(
      () => {
        this.setState({
          time: this.state.time - 1
        });
        if (this.state.time === 0) {
          this.props.router.push('/');
        }
      },
      1000
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <div className="not-found">
        <div className="header">
          <div className="container">
            <img src="/img/logo_slogan@2x.png" alt="" className="logo" />
          </div>
        </div>
        <figure>
          <img alt="" src={getPath('/img/404@1x.png')} srcSet={getPath('/img/404@2x.png 2x')} />
          <figcaption>sorry, the page is missinig...</figcaption>
          <p>{this.state.time}return to home page after 3 seconds</p>
        </figure>
      </div>
    );
  }
}
