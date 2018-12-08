import React, { Component } from 'react';
import './NetworkStats.css';
import { connect } from 'react-redux';
import { Sparklines, SparklinesBars } from 'react-sparklines';

/**
 * NetworkStats Component
 * @extends Component
 */
class NetworkStats extends Component {
  render() {
    let networkStats = this.props.networkStats;
    return (
      <div className="NetworkStats">
        <div className="row" id="network-stats-panel">
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Best Block</h4>
              </div>
              <div className="card-body"># {networkStats.bestBlock}</div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Last Block</h4>
              </div>
              <div className="card-body"> {networkStats.lastBlock}</div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Avg Block Time</h4>
              </div>
              <div className="card-body"> {networkStats.avgBlockTime} </div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Avg Hashrate</h4>
              </div>
              <div className="card-body"> {networkStats.avgHashRate} </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card network-stats-card">
              <div className="card-header text-center chart-header">
                <h4 className="card-title">Block Time</h4>
              </div>
              <div className="card-body">
                {/* <Sparklines width={150} data={[...networkStats.avgBlockTime]} className="big-details spark-blocktimes">
                  <SparklinesBars />
                </Sparklines> */}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Watt Limit</h4>
              </div>
              <div className="card-body"> {networkStats.wattLimit} ω</div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Page Latency</h4>
              </div>
              <div className="card-body">{networkStats.pageLatency}</div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Uptime</h4>
              </div>
              <div className="card-body"> {networkStats.uptime}</div>
            </div>
          </div>
          <div className="col-2 pr-0">
            <div className="card network-stats-card">
              <div className="card-header text-center">
                <h4 className="card-title">Active Nodes</h4>
              </div>
              <div className="card-body">{networkStats.activeNodes}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="card network-stats-card">
              <div className="card-header text-center chart-header">
                <h4 className="card-title">Block Propagation</h4>
              </div>
              <div className="card-body">
                {/* <histogram className="big-details d3-blockpropagation" data="blockPropagationChart"></histogram> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    networkStats: state.networkStats
  }
}

export default connect(mapStateToProps)(NetworkStats);
