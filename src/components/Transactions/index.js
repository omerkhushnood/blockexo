import React, { Component } from 'react';
import './Transactions.css';
import { connect } from 'react-redux';

/**
 * Transactions Component
 * @extends Component
 */
class Transactions extends Component {
  render() {
    let { transactions } = this.props;

    const transactionsList = transactions.length
      ? transactions.map(transaction => {
        return (
          <tr className="transaction-item" key={ transaction }>
            <td>{ transaction }</td>
          </tr>
        )
      })
    : (
      <tr>
        <td>No Transactions</td>
      </tr>
    )

    return (
      <div className="card transactions-card">
        <div className="card-header">
          <h4 className="card-title">Transactions</h4>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              { transactionsList }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    transactions: state.transactions.list
  }
}

export default connect(mapStateToProps)(Transactions);
