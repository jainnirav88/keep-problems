/*global chrome*/
import React, { Component } from 'react';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars';
import ReactTooltip from 'react-tooltip';

export default class AddProblem extends Component {
  constructor(props) {
    super(props);

    this.codeforces = this.codeforces.bind(this);
    this.onChangeLink = this.onChangeLink.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDifficulty = this.onChangeDifficulty.bind(this);
    this.onChangeFolder = this.onChangeFolder.bind(this);
    this.onChangeTags = this.onChangeTags.bind(this);
    this.onChangeCode = this.onChangeCode.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.folderList = this.folderList.bind(this);

    this.state = {
      link: '',
      name: '',
      difficulty: 0,
      folder: '',
      tags: '',
      code: '',
      notes: '',
      folders: [],
      links: [],
      error: false,
      errorMessage: "Some Error Occured!!!",
    };
  }

  componentDidMount() {
    // Fetch current tab link
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      let link = tabs[0].url;
      let title = tabs[0].title;
      let url = new URL(link);

      this.setState({
        link: link
      });

      // If codeforces link then fetch Problem Name and Rating using Codeforces API
      switch (url.hostname) {
        case "codeforces.com": {
          this.setState({
            folder: "codeforces"
          });

          this.codeforces(link);
          break;
        }
        case "www.codechef.com": {
          let arr = title.split(' | ');

          this.setState({
            name: arr[0] !== undefined ? arr[0] : "",
            folder: "codechef"
          });
          break;
        }
        case "atcoder.jp": {
          let arr = title.split(' - ');

          this.setState({
            name: arr[1] !== undefined ? arr[1] : "",
            folder: "atcoder"
          });
          break;
        }
        case "leetcode.com": {
          let arr = title.split(' - ');

          this.setState({
            name: arr[0] !== undefined ? arr[0] : "",
            folder: "leetcode"
          });
          break;
        }
        case "practice.geeksforgeeks.org": {
          let arr = title.split(' | ');

          this.setState({
            name: arr[0] !== undefined ? arr[0] : "",
            folder: "geeksforgeeks"
          });
          break;
        }
        case "www.hackerearth.com": {
          let arr = title.split(' | ');

          this.setState({
            name: arr[0] !== undefined ? arr[0] : "",
            folder: "hackerearth"
          });
          break;
        }
        default: {
          this.setState({
            folder: url.hostname
          });
        }
      }
    });

    // Fetch problems-list from server
    axios.get(`http://localhost:${process.env.REACT_APP_PORT}/problems`)
      .then(res => {
        console.log('Problem list from the server: ', res.data);

        // Create a folders-list from problems-list.
        let folders = new Set();
        let links = [];

        res.data.forEach(problem => {
          if (problem.folder !== "") {
            folders.add(problem.folder)
          }

          links.push(problem.link);
        });

        console.log("Folders : ", folders);

        this.setState({
          folders: [...folders].sort(),
          links: links,
          error: false,
          errorMessage: "Some Error Occured!!!"
        });
      })
      .catch(err => {
        console.log('Error: ' + err);
        this.setState({ error: true });
      });
  }

  codeforces(link) {
    let type1Link = "https://codeforces.com/problemset/problem/";
    let type2Link = "https://codeforces.com/contest/";

    let contestId = -1, problemIndex = -1;

    if (link.includes(type1Link)) {

      // Fetch contestId from link
      let startPos = type1Link.length;
      let endPos = link.indexOf("/", startPos);
      contestId = Number(link.substr(startPos, endPos - startPos));

      // Fetch index of problem
      startPos = link.lastIndexOf("/") + 1;
      problemIndex = link.substr(startPos, link.length - startPos);

    } else if (link.includes(type2Link)) {

      // Fetch contestId from link
      let startPos = type2Link.length;
      let endPos = link.indexOf("/", startPos);
      contestId = Number(link.substr(startPos, endPos - startPos));

      // Fetch index of problem
      startPos = link.lastIndexOf("/") + 1;
      problemIndex = link.substr(startPos, link.length - startPos);

    } else {
      console.log("Not a Codeforces problem link.");
    }

    if (contestId !== -1 && problemIndex !== -1) {
      let url = "https://codeforces.com/api/contest.standings?contestId=" + contestId + "&from=1&count=1";

      axios.post(url)
        .then(res => {
          res.data.result.problems.forEach(currentProblem => {
            if (currentProblem.index.toString() === problemIndex.toString()) {

              let tags = "";
              if (currentProblem.tags !== undefined) {
                currentProblem.tags.forEach(currentTag => {
                  if (tags.length === 0) {
                    tags = currentTag;
                  } else {
                    tags += ", " + currentTag
                  }
                });
              }

              this.setState({
                name: currentProblem.name !== undefined ? currentProblem.name.toString() : "",
                tags: tags,
                difficulty: currentProblem.rating !== undefined ? Number(currentProblem.rating) : 0
              });
            }
          });
        })
        .catch(err => {
          console.log("Error : " + err);
          this.setState({
            error: true,
            errorMessage: "API error, Add data manually or try after some time."
          });
        });
    }
  }

  onChangeLink(e) {
    this.setState({
      link: e.target.value
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeDifficulty(e) {
    this.setState({
      difficulty: e.target.value
    });
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

  onChangeCode(e) {
    this.setState({
      code: e.target.value
    });
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.links.includes(this.state.link)) {
      this.setState({
        error: true,
        errorMessage: "Problem already exists."
      });
      return;
    }

    let tags = new Set();

    this.state.tags.split(',').forEach(currentTag => {
      if (currentTag.trim() !== "") {
        tags.add(currentTag.trim());
      }
    });

    const problem = {
      link: this.state.link,
      name: this.state.name !== "" ? this.state.name : this.state.link,
      difficulty: Number(this.state.difficulty),
      folder: this.state.folder,
      tags: [...tags],
      code: this.state.code,
      notes: this.state.notes,
    };

    console.log("Saving: ", problem);

    axios.post(`http://localhost:${process.env.REACT_APP_PORT}/problems/add`, problem)
      .then(res => {
        console.log("Response : " + res.data);
        this.props.setPage('Home');
      })
      .catch(err => {
        console.log('Error: ' + err);
        this.setState({ error: true });
      });
  }

  folderList() {
    return this.state.folders.map(currentFolder => {
      return <li key={currentFolder}>
        <button type="button"
          className="dropdown-item text-break"
          style={{ whiteSpace: 'normal' }}
          onClick={() => { this.setState({ folder: currentFolder }) }}>
          {currentFolder}
        </button>
      </li>;
    });
  }

  render() {
    return (
      <div className="container-fluid mt-1 p-0 border rounded">
        <Scrollbars style={{ height: 392.56 }}>
          { // Any error ?
            this.state.error &&
            <div className="alert alert-warning" role="alert">
              {this.state.errorMessage}
            </div>
          }

          <ReactTooltip delayShow={400} />

          {/* Form */}
          <form onSubmit={this.onSubmit}
            className="clearfix"
            style={{ padding: "0.25rem 0.6rem 0.25rem 0.25rem" }}>
            {/* Link */}
            <div className="form-group row my-1">
              <label className="form-label col-2 ms-1">Link: </label>

              <input type="text"
                required
                className="form-control form-control-sm col"
                value={this.state.link}
                placeholder="Required"
                onChange={this.onChangeLink}
              />
            </div>

            {/* Name */}
            <div className="form-group row my-1">
              <label className="form-label col-2 ms-1">Name: </label>

              <input type="text"
                className="form-control form-control-sm col"
                value={this.state.name}
                placeholder="Name"
                onChange={this.onChangeName}
              />
            </div>

            {/* Folder */}
            <div className="form-group row my-1">
              <label className="form-label col-2 ms-1">Folder: </label>

              <div className="btn-group col">
                <input className="form-control form-control-sm"
                  type="text"
                  placeholder="Folder (case-sensitive)"
                  value={this.state.folder}
                  onChange={this.onChangeFolder}
                  style={{ borderRadius: ".25rem 0rem 0rem .25rem" }}
                />

                <button type="button"
                  className="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split px-2"
                  id="dropdownMenuFolder"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-bs-reference="parent"
                  data-tip="Folders"
                  data-type="info">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end position-absolute"
                  aria-labelledby="dropdownMenuFolder">
                  <Scrollbars style={{ height: 190, width: '13rem' }}>
                    {this.folderList()}
                  </Scrollbars>
                </ul>
              </div>
            </div>

            <div className="form-group row accordion accordion-flush my-1">
              <div className="accordion-item">
                <span className="accordion-header"
                  id="headingDifficulty"
                  data-tip="Enter Difficulty"
                  data-type="info">
                  <button className="accordion-button collapsed border"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseDifficulty"
                    aria-expanded="false"
                    aria-controls="collapseDifficulty">
                    Difficulty:
                  </button>
                </span>

                <div className="accordion-collapse collapse"
                  id="collapseDifficulty"
                  aria-labelledby="headingDifficulty">
                  <input type="number"
                    className="form-control form-control-sm col"
                    value={this.state.difficulty}
                    onChange={this.onChangeDifficulty}
                  />
                </div>
              </div>
            </div>

            <div className="form-group row accordion accordion-flush my-1">
              <div className="accordion-item">
                <span className="accordion-header"
                  id="headingTags"
                  data-tip="Enter Tags (comma-separated)"
                  data-type="info">
                  <button className="accordion-button collapsed border"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTags"
                    aria-expanded="false"
                    aria-controls="collapseTags">
                    Tags:
                  </button>
                </span>

                <div className="accordion-collapse collapse"
                  id="collapseTags"
                  aria-labelledby="headingTags">
                  <textarea
                    className="accordion-body form-control form-control-sm"
                    rows="3"
                    value={this.state.tags}
                    placeholder="Enter comma-separated values"
                    onChange={this.onChangeTags}
                  />
                </div>
              </div>
            </div>

            <div className="form-group my-1">
              <label className="form-label mb-0 ms-1">Code: </label>

              <textarea className="form-control form-control-sm"
                rows="4"
                value={this.state.code}
                onChange={this.onChangeCode}
              />
            </div>

            <div className="form-group my-1">
              <label className="form-label mb-0 ms-1">Notes: </label>

              <textarea className="form-control form-control-sm"
                rows="4"
                value={this.state.notes}
                onChange={this.onChangeNotes}
              />
            </div>

            <div className="form-group float-end my-1">
              <input type="submit" value="Save" className="btn btn-primary" />
            </div>
          </form>
        </Scrollbars>
      </div>
    );
  }
}