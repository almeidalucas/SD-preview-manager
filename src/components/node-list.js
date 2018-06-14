import React, { Component } from 'react';
import '../styles/node.styles.css';

import Node from './node';

const SockJS = require('../js/sockjs');
const Stomp = require('../js/stomp');

let socket = null;
let stompClient = null;

class NodeList extends Component {

  state = {
    nodeList: [],
  };


  componentDidMount() {
    /*
    --INICIO download arquivo--
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(['1', '23']));
    element.setAttribute('download', 'nome-teste');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    --FIM Download arquivo--
    */

    socket = SockJS('http://localhost:8090/sistemas-distribuidos');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/ws-client/add-node', (res) => {
        console.log('add-node -> ', res);
        this.setState({nodeList: [...this.state.nodeList, JSON.parse(res.body)]});
      });
      stompClient.subscribe('/ws-client/remove-node', (res) => {
        console.log('remove-node -> ', res);
        const nodeList = this.state.nodeList.filter((node) => node.nodeId !== res.body);
        this.setState({nodeList});
      });
      stompClient.subscribe('/ws-client/preview-manager', (res) => {
        console.log('preview-manager -> ', res);
        this.setState({nodeList: JSON.parse(res.body)});
      });
      stompClient.subscribe('/ws-client/ordered-node', (res) => {
        console.log('ordered-node -> ', JSON.parse(res.body));
        const resNode = JSON.parse(res.body);
        const nodeList = this.state.nodeList.filter((node) => node.nodeId !== resNode.nodeId);
        this.setState({nodeList: [...nodeList, JSON.parse(res.body)]});
      });
    });
    setTimeout(() => stompClient.send('/manager/request-nodes', {}, 'Nome'), 2000);
  }

  requestNodeLists = () => stompClient.send('/manager/node', {}, this.state.nodeList.length);

  render() {
    const {nodeList} = this.state;

    return (
      <div className='node-list-container'>

        {
          nodeList.length === 0 ?
            <p>Nenhum nó conectado...</p>
            :
            nodeList.map((item, index) => {
              console.log(index, item);
              return (
                <Node
                  index={index}
                  key={item.nodeId}
                  {...item}
                  onClick={this.requestNodeLists}
                />
              );
            })
        }

      </div>
    );
  }
}

export default NodeList;