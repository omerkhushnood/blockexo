import React, { Component } from 'react';
import './NodeInfo.css';
import { connect } from 'react-redux';

/**
 * NodeInfo Component
 * @extends Component
 */
class NodeInfo extends Component {

  render() {

    let nodeInfo = this.props.nodes.list.find(node => String(node.id) === String(this.props.nodes.currentNodeId));


    return (nodeInfo !== null) && (nodeInfo !== undefined)
      ? (
        <div className="NodeInfo">
          <div className="card node-details-table">
            <div className="card-header">
              <h4 className="card-title text-center">{ nodeInfo.info.name }</h4>
              <span className="node-close-btn" onClick={() => this.props.nodeSelected(null)}>
                <i className="fa fa-times"></i>
              </span>
            </div>
            <div className="card-body">
              <div className="card-block">
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Node Type:</th>
                      <td className="node-details-type" rel="node.id">
                        <span className="small">{ nodeInfo.info.node }</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Node latency:</th>
                      <td className="node-details-latency">
                        <span className="small"> { nodeInfo.stats.latency } </span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Peers:</th>
                      <td className="node-details-peers">{ nodeInfo.stats.peers }</td>
                    </tr>
                    <tr>
                      <th scope="row">Pending transactions:</th>
                      <td className="node-details-pending-transactions">{ nodeInfo.stats.pending }</td>
                    </tr>
                    <tr>
                      <th scope="row">Last block:</th>
                      <td className="node-details-last-block">
                        <span className="">
                          # { nodeInfo.stats.block.number }
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="node-details-block-hash" colSpan="2">
                        <span className="small">{ nodeInfo.stats.block.hash }</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Total difficulty:</th>
                      <td className="node-details-total-difficulty">
                        <span className="small">{ nodeInfo.stats.block.difficulty }</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Block transactions:</th>
                      <td className="node-details-block-transactions">{ nodeInfo.stats.block.transactions.length }</td>
                    </tr>
                    <tr>
                      <th scope="row">Last block time:</th>
                      <td className="node-details-last-block-time">{ nodeInfo.stats.block.time }</td>
                    </tr>
                    <tr>
                      <th scope="row">Propagation time:</th>
                      <td className="node-details-propagation-time">
                        <div className="propagationBox"></div>
                        <span>{ nodeInfo.stats.block.propagation }	</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Average propagation time:</th>
                      <td className="node-details-average-propagation-time">{ nodeInfo.stats.propagationAvg }</td>
                    </tr>
                    <tr>
                      <th scope="row">Up-time:</th>
                      <td className="node-details-uptime">{ nodeInfo.stats.uptime } %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )
      : (
        <div className="NodeInfo">
          <div className="card node-details-table" id="default-node-pane">
            <div className="card-header">
              <h4 className="card-title text-center">&nbsp;</h4>
            </div>
            <div className="card-body">
              <div className="card-block">
                <span id="default-node-info" onClick={() => this.props.nodeSelected('videoCoinNode0')}>
                  <i className="fa fa-plus-circle"></i>
                </span>
                <span className="default-node-clickhere-text">
                  Click on the nodes under topology to load the node information
                </span>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

const mapStateToProps = (state, orgProps) => {
  return {
    nodes: {...state.nodes, currentNodeId: orgProps.currentNodeId}
  }
}

export default connect(mapStateToProps)(NodeInfo);
