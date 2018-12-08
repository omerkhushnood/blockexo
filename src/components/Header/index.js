import React from 'react';

/**
 * Header UI Component
 * @param {Object} props [description]
 */
const Header = ({ title }) => {
  return (
    <div className="navbar navbar-expand-lg navbar-light bg-faded header-navbar">
      <div className="container">
        <div className="navbar-header">
          <img src="/assets/decor.png" alt="VideoCoin Dev Net" />
          <h1>{ title }</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
