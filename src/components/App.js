import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Topology from './Topology';
import NodeInfo from './NodeInfo';
import NetworkStats from './NetworkStats';
import Rewards from './Rewards';
import Transactions from './Transactions';

/**
 * App Component
 * @extends Component
 */
class App extends Component {
  state = {
    title: 'VideoCoin Dev Net',
    currentNodeId: null
  }

  onNodeSelected = (id) => {
    this.setState({
      currentNodeId: id
    });
  }

  render() {
    return (
      <div className="wrapper nav-collapsed menu-collapsed">
        <Header title={this.state.title} />
        <div className="main-panel">
          <div className="main-content">
            <div className="content-wrapper">
              <div className="row match-height">
                <div className="col-xl-6 col-lg-12 col-12">
                  <Topology nodeSelected={this.onNodeSelected} />
                </div>
                <div className="col-xl-6 col-lg-12 col-12">
                  <NodeInfo nodeSelected={this.onNodeSelected} currentNodeId={this.state.currentNodeId} />
                </div>
              </div>
              <NetworkStats />
              <div className="row match-height">
                <div className="col-xl-6 col-lg-12 col-12">
                  <Rewards />
                </div>
                <div className="col-xl-6 col-lg-12 col-12">
                  <Transactions />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
