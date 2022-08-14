/*global chrome*/
import React, { Component } from 'react';
import axios from 'axios';
import Scrollbars from 'react-custom-scrollbars';
import ReactTooltip from 'react-tooltip';

export default class AddProblem extends Component {
  constructor(props) {
    super(props);

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
      errorMessage: "Some Error Occured!!!"
    };
  }

  componentDidMount() {
    // Fetch problems-list from server
    axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems`)
      .then(res => {
        console.log('Problem list from the server: ', res.data);

        // Create folders-list from problems-list.
        let folders = new Set();

        res.data.forEach(problem => {
          if (problem.folder !== "") {
            folders.add(problem.folder)
          }

          if (problem._id === this.props.match.params.id) {
            console.log("tags-list:", problem.tags);

            let tags = "";
            problem.tags.forEach(currentTag => {
              if (tags.length === 0) {
                tags = currentTag;
              } else {
                tags += ", " + currentTag
              }
            });

            this.setState({
              link: problem.link,
              name: problem.name,
              difficulty: problem.difficulty,
              folder: problem.folder,
              tags: tags,
              code: problem.code,
              notes: problem.notes,
              error: false
            });
          }
        });

        console.log("Folders : ", folders);

        this.setState({
          folders: [...folders].sort()
        });
      })
      .catch(err => {
        console.log('Error: ' + err);
        this.setState({ error: true });
      });
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

    // Save problems
    axios.post(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems/update/` + this.props.match.params.id, problem)
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