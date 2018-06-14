import React, { Component } from 'react';
import '../styles/node.styles.css';

class Node extends Component {

  render() {
    const {nodeId, index, onClick} = this.props;

    return (
      <div className='node-container' onClick={onClick}>
        <div className='node'>
          <p className='node-p'>{index + 1}</p>
        </div>
        <p className='node-id'>Node ID: {nodeId}</p>
      </div>
    );
  }
}

export default Node;