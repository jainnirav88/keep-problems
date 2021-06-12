import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./App.css";

import Navbar from "./components/navbar.component";
import ProblemList from "./components/problem-list.component";
import AddProblem from "./components/add-problem.component";
import EditProblem from './components/edit-problem.component';
import Other from './components/other.component';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.setPage = this.setPage.bind(this);
    this.setId = this.setId.bind(this);
    this.loadPage = this.loadPage.bind(this);

    this.state = {
      page: 'Home',
      id: ''
    };
  }

  setPage(page) {
    this.setState({
      page: page
    });
  }

  setId(id) {
    this.setState({
      id: id
    });
  }

  loadPage() {
    switch (this.state.page) {
      case 'Home':
        return <ProblemList setPage={this.setPage} setId={this.setId} />
      case 'Add':
        return <AddProblem setPage={this.setPage} />
      case 'Edit':
        return <EditProblem setPage={this.setPage} _id={this.state.id} />
      case 'Other':
        return <Other />
      default:
        break;
    }
  }

  render() {
    return (
      <div className="p-1">
        <Navbar setPage={this.setPage} />
        { this.loadPage() }
      </div>
    );
  };
}