/* global chrome */
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';

export default class Other extends Component {
  constructor(props) {
    super(props);

    this.onChangeFile = this.onChangeFile.bind(this);
    this.onChangeFolder = this.onChangeFolder.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.clearAllProblems = this.clearAllProblems.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      fileProblems: [],
      folder: '',
      tags: '',
      error: false,
      success: false
    };
  }

  onChangeFile(e) {
    try {
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("File content : ", e.target.result);
        try {
          let fileProblems = JSON.parse(e.target.result);

          if (typeof fileProblems === 'object') {
            this.setState({
              fileProblems: fileProblems,
              error: false,
              success: false
            });
          }
          else {
            console.log("Invalid input");

            this.setState({
              error: true
            });
          }
        } catch (err) {
          console.log('Error: ', err);

          this.setState({
            error: true
          });
        }
      };
    } catch (err) {
      console.log('Error : ', err);

      this.setState({
        error: true
      });
    }
  }

  onChangeFolder(e) {
    this.setState({
      folder: e.target.value
    });
  }

  onChangeTags(e) {
    this.setState({
      tags: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    try {
      this.state.fileProblems.forEach(currentProblem => {
        let tags = new Set([...currentProblem.tags]);

        if (this.state.tags !== '') {
          this.state.tags.split(',').forEach(currentTag => {
            if (currentTag.trim() !== "") {
              tags.add(currentTag.trim());
            }
          });
        }

        let problem = {
          link: String(currentProblem.link),
          name: String(currentProblem.name),
          difficulty: Number(currentProblem.difficulty),
          folder: this.state.folder !== '' ? this.state.folder : String(currentProblem.folder),
          tags: [...tags],
          code: String(currentProblem.code),
          notes: String(currentProblem.notes),
        }

        axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems/add`, problem)
          .then(res => {
            console.log("Response : " + res.data);
          })
          .catch(err => {
            console.log('Error: ' + err);
          });
      });

      e.target.reset();
      
      this.setState({
        fileProblems: [],
        folder: '',
        tags: '',
        error: false,
        success: true
      });
    } catch (err) {
      console.log('Error : ', err);

      this.setState({
        error: true
      });
    }
  }

  clearAllProblems() {
    axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems/`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log('Error: ' + err)
      });
  }

  render() {
    return (
      <div style={{ height: 394.55 }}>
        <ReactTooltip delayShow={400} />

        {/* Import */}
        <form onSubmit={this.onSubmit}
          className="border rounded my-1">
          <div className="form-group">
            <div className="container">
              <label className="form-label m-0 fw-bold">Import?</label>
            </div>

            <hr className="my-1" />

            <div className="container">
              <input className="form-control form-control-sm"
                required
                type="file"
                accept=".json"
                data-tip='Only provide valid json file which is exported from "Keep Problems" extension.'
                data-type="info"
                onChange={ this.onChangeFile } />
            </div>
          </div>

          <div className="container clearfix">
            {/* Folder */}
            <div className="form-group row my-1">
              <label className="form-label col-2 ms-1">Folder: </label>
              <input type="text"
                className="form-control form-control-sm col"
                value={this.state.folder}
                placeholder="Folder (case-sensitive) (optional)"
                onChange={this.onChangeFolder}
              />
            </div>

            {/* Tags */}
            <div className="form-group row my-1">
              <label className="form-label col-2 ms-1">Tags: </label>
              <input type="text"
                className="form-control form-control-sm col"
                value={this.state.tags}
                data-tip="Tags will be appended in existing tags"
                data-type="info"
                placeholder="Tags (comma-separated) (optional)"
                onChange={this.onChangeTags}
              />
            </div>

            {/* Error and submit */}
            <div className="clearfix form-group my-1">
              {
                this.state.error &&
                <div role="alert"
                  className="alert alert-warning d-inline-flex px-2 py-0 m-0 col-10" >
                  Invalid input.
              </div>
              }

              {
                this.state.success &&
                <div role="alert"
                  className="alert alert-success d-inline-flex px-2 py-0 m-0 col-10" >
                  Problems saved.
              </div>
              }

              <input type="submit"
                value="Submit"
                className="btn btn-sm btn-primary float-end"
              />
            </div>
          </div>
        </form>

        {/* Clear */}
        <div className="border rounded my-1">
          <div className="container">
            <label className="form-label m-0 fw-bold">Clear?</label>
          </div>

          <hr className="my-1" />

          <div className="container clearfix form-group my-1">
            <label className="form-label">
              Delete all problems from Local Storage.
            </label>

            <button type="button"
              className="btn btn-sm btn-danger float-end"
              onClick={() => this.clearAllProblems()}>
              Clear
            </button>
          </div>
        </div>

        {/* About */}
        <div className="border rounded my-1">
          <div className="container">
            <label className="form-label m-0 fw-bold">About</label>
          </div>

          <hr className="my-1" />

          <h3 className="text-center">
            Keep Problems
          </h3>

          <ul className="list-unstyled mb-0">
            <li className="text-center text-muted">
              Developer: Nirav Jain
            </li>

            <li className="text-center">
              <a className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
                href="https://github.com/jainnirav88/keep-problems">
                Github Repository
              </a>
            </li>

            <li className="text-center">
              <a className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
                href="https://chrome.google.com/webstore/detail/keep-problems/bpcgbgiipbblkoajepkmlcdgafnhiamp/reviews">
                Review here please :)
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}