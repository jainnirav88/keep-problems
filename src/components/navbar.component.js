import React, { Component } from 'react';
import { BiHome, BiPlusCircle } from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark p-0">
        {/* Navbar */}
        <ul className="nav navbar-nav">
          <ReactTooltip delayShow={400} />

          {/* Home */}
          <li className="navbar-item p-2">
            <button className="btn nav-link p-0"
              data-tip="Home"
              data-type="info"
              onClick={() => { this.props.setPage('Home') }}>
              <BiHome style={{ height: "1.4rem", width: "1.4rem" }} />
            </button>
          </li>

          {/* Add Problem */}
          <li className="navbar-item p-2">
            <button className="btn nav-link p-0"
              data-tip="Add Problem"
              data-type="info"
              onClick={() => this.props.setPage('Add')}>
              <BiPlusCircle style={{ height: "1.4rem", width: "1.4rem" }} />
            </button>
          </li>
        </ul>

        {/* Other */}
        <ul className="nav navbar-nav">
          <li className="navbar-item p-2">
            <button className="btn nav-link p-0"
              data-tip="Other"
              data-type="info"
              onClick={() => this.props.setPage('Other')}>
              <span>Other</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}