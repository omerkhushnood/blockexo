import React, { Component } from 'react';
import './Rewards.css';
import { connect } from 'react-redux';

/**
 * Rewards Component
 * @extends Component
 */
class Rewards extends Component {
  render() {
    // let { nodes } = this.props;
    // let minerNodes = nodes.filter(node => node.stats.mining === true);
    // const minersList = nodes.length
    //   ? nodes.map(miner => {
    //     return (
    //       <tr className="miner-item" key={ miner.id }>
    //         <th className="no-border" scope="row">{ miner.info.name }</th>
    //         <td className="no-border">{ miner.info.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
    //       </tr>
    //     )
    //   })
    // : (
    //   <tr>
    //     <td colSpan="2" className="no-border small text-italic text-center">Looking for miners...</td>
    //   </tr>
    // )

    return (
      <div className="card rewards-card">
        <div className="card-header">
          <h4 className="card-title">Miner Rewards</h4>
        </div>
        <div className="card-body">
          <table className="table">
            <tbody>
              <tr className="miner-item">
                <th className="no-border" scope="row">{ this.props.miners.videoCoinNode0.name }</th>
                <td className="no-border">{ this.props.miners.videoCoinNode0.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
              </tr>
              <tr className="miner-item">
                <th className="no-border" scope="row">{ this.props.miners.videoCoinNode1.name }</th>
                <td className="no-border">{ this.props.miners.videoCoinNode1.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
              </tr>
              <tr className="miner-item">
                <th className="no-border" scope="row">{ this.props.miners.videoCoinNode2.name }</th>
                <td className="no-border">{ this.props.miners.videoCoinNode2.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
              </tr>
              <tr className="miner-item">
                <th className="no-border" scope="row">{ this.props.miners.videoCoinNode3.name }</th>
                <td className="no-border">{ this.props.miners.videoCoinNode3.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
              </tr>
              <tr className="miner-item">
                <th className="no-border" scope="row">{ this.props.miners.videoCoinNode4.name }</th>
                <td className="no-border">{ this.props.miners.videoCoinNode4.balance_latest }<span className="small text-italic">&nbsp; VID</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    miners: state.rewards
  }
}

export default connect(mapStateToProps)(Rewards);
