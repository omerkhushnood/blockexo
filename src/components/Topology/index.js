import React, { Component } from 'react';
// VIS.js library to draw network topology.
import vis from 'vis';
import { connect } from 'react-redux';
import './Topology.css';

/**
 * Topology Component
 * @extends Component
 */
class Topology extends Component {
  state = {
    defaultMessage: 'Searching active nodes...'
  }

  static getDerivedStateFromProps(props, state){
    if(props.nodes.length) {
      let nodesList = props.nodes.map(node => {
        let visItem = {};
        visItem.id = node.id;
        visItem.label = node.name;
        if(node.type !== null)
          visItem.group = node.type;
        return visItem;
      })

      var nodes = new vis.DataSet(nodesList);
      var edges = new vis.DataSet([
        {from: 'videoCoinNode0', to: 'videoCoinNode1', dashes:true},
        {from: 'videoCoinNode2', to: 'videoCoinNode1', dashes:[5,5,3,3]},
        {from: 'videoCoinNode2', to: 'videoCoinNode3', dashes:[5,5,3,3]},
        {from: 'videoCoinNode3', to: 'videoCoinNode0', dashes:[2,2,10,10]},
        {from: 'videoCoinNode1', to: 'videoCoinNode3', dashes:[5,5]},
        {from: 'videoCoinNode2', to: 'videoCoinNode4', dashes:[5,5,3,3]},
        {from: 'videoCoinNode0', to: 'videoCoinNode4', dashes:[5,5,3,3]}
      ]);
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        nodes: {
          shape: 'dot',
          size: 10,
          font: {
            size: 14,
            color: '#343a40'
          },
          borderWidth: 0
        },
        edges: {
          width: 1,
          color: '#444444'
        },
        groups: {
          miner: {
            shape: 'circularImage',
            image: '/assets/decor.png',
            size: 30,
            borderWidth: 0
          }
        }
      };
      let network = new vis.Network(container, data, options);
      network.on("click", (params) => {
        if(params.nodes.length) {
          props.nodeSelected(params.nodes[0])
        }
      });
    }
    return state;
  }

  render() {

    return (
      <div className="card topology-card">
        <div className="card-header">
          <h4 className="card-title">Topology</h4>
        </div>
        <div className="card-body">
          <div className="card-block">
            <div id="mynetwork"></div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nodes: state.topology.nodes
  }
}

export default connect(mapStateToProps)(Topology);
