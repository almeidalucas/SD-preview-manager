import React, { Component } from 'react';
import '../styles/container.styles.css';
import FooterContainer from './footer-container';
import NodeList from './node-list';

class Container extends Component {

  render() {
    return (
      <div className='container'>
        <NodeList/>
        <FooterContainer/>
      </div>
    );
  }
}

export default Container;