import React, {Component} from 'react';
import './app.less';

class App extends Component {
  render() {
    return (
      <div id="app">
        {this.props.children}
      </div>
    );
  }
}

export default App;
