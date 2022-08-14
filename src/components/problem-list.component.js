/*global chrome*/
import React, { Component } from 'react';
import axios from 'axios';
import Problem from "./problem.component";
import { Scrollbars } from 'react-custom-scrollbars';
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import ReactTooltip from 'react-tooltip';

export default class ProblemList extends Component {
  constructor(props) {
    super(props);

    this.onChangeFolder = this.onChangeFolder.bind(this);
    this.folderList = this.folderList.bind(this);
    this.exportJSON = this.exportJSON.bind(this);
    this.searchProblem = this.searchProblem.bind(this);
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.onClickSortByName = this.onClickSortByName.bind(this);
    this.onClickSortByDate = this.onClickSortByDate.bind(this);
    this.onClickSortByDifficulty = this.onClickSortByDifficulty.bind(this);
    this.deleteProblem = this.deleteProblem.bind(this);
    this.problemList = this.problemList.bind(this);

    /*
    problems:       Problems which will be displayed.
    folderProblems: Problems whose folder is same as "this.state.folder".
    allProblems:    All problems which are stored in the database.
    currentFolder:  Folder which is currently selected.
    folders:        All the available distinct folders.
    searchOption:   Possible values at [0, 1],
                    0: ('Name', 'Link', 'Difficulty', 'Tags'), 
                    Only for 'Difficulty' 1: ( true(>=), false(<=) ),
    sortOption:     0: ('Name', 'Date', 'Difficulty'),
                    1: ( true('Ascending order'), false('Descending order') )
    error:          To show error message.
    */

    this.state = {
      problems: [],
      folderProblems: [],
      allProblems: [],
      currentFolder: 'All',
      folders: [],
      showDifficulty: false,
      searchOption: ['Name', true],
      searchValue: '',
      sortOption: ['', true],
      error: false
    };
  }

  componentDidMount() {
    console.log(`Backend server is running on port ${process.env.REACT_APP_BACKEND_SERVER_PORT}`);
    
    // Fetch problems-list from server.
    axios.get(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems`)
      .then(res => {
        console.log('Problem list from the server: ', res.data);

        // Create a folders-list from the problems-list.
        let folders = new Set(['All']);

        res.data.forEach(problem => {
          if (problem.folder !== "") {
            folders.add(problem.folder)
          }
        });

        console.log("Folders : ", folders);

        this.setState({
          problems: res.data,
          folderProblems: res.data,
          allProblems: res.data,
          folders: [...folders].sort(),
          error: false
        }, () => {
          this.onClickSortByDate();
        });
      })
      .catch(err => {
        console.log('Error: ' + err);
        this.setState({ error: true });
      });
  }

  onChangeFolder(folder) {
    if (folder === 'All') {
      this.setState({
        currentFolder: folder,
        problems: this.state.allProblems,
        folderProblems: this.state.allProblems
      });
    }
    else {
      this.setState({
        currentFolder: folder,
        problems: this.state.allProblems.filter(currentProblem => {
          return currentProblem.folder === folder;
        }),
        folderProblems: this.state.allProblems.filter(currentProblem => {
          return currentProblem.folder === folder;
        })
      });
    }
  }

  folderList() {
    return this.state.folders.map(currentFolder => {
      return <li key={currentFolder}>
        <button type="button"
          className="dropdown-item text-break"
          style={{ whiteSpace: 'normal' }}
          onClick={() => { this.onChangeFolder(currentFolder) }}>
          {currentFolder}
        </button>
      </li>;
    });
  }

  exportJSON() {
    // Export problems-list in JSON form.
    let problems = JSON.stringify(this.state.problems, null, '\t');
    let a = document.createElement("a");
    let file = new Blob([problems], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'problems.json';
    a.click();
  }

  searchProblem(e) {
    if (e.target.value === "") {
      this.setState({
        searchValue: e.target.value,
        problems: this.state.folderProblems
      });
    } else {
      switch (this.state.searchOption[0]) {
        case 'Name': {
          let target = e.target.value.toLowerCase();

          this.setState({
            searchValue: e.target.value,
            problems: this.state.folderProblems.filter(currentProblem => {
              return currentProblem.name.toLowerCase().startsWith(target);
            })
          });
          break;
        }
        case 'Link': {
          let target = e.target.value.toLowerCase();

          this.setState({
            searchValue: e.target.value,
            problems: this.state.folderProblems.filter(currentProblem => {
              return currentProblem.link.toLowerCase().startsWith(target);
            })
          });
          break;
        }
        case 'Difficulty': {
          let target = Number(e.target.value);

          if (this.state.searchOption[1]) {
            this.setState({
              searchValue: e.target.value,
              problems: this.state.folderProblems.filter(currentProblem => {
                return currentProblem.difficulty >= target;
              })
            });
          } else {
            this.setState({
              searchValue: e.target.value,
              problems: this.state.folderProblems.filter(currentProblem => {
                return currentProblem.difficulty <= target;
              })
            });
          }
          break;
        }
        case 'Tags': {
          let tags = e.target.value.trim().split(',').filter(currentTag => {
            return currentTag.trim() !== "";
          });

          this.setState({
            searchValue: e.target.value,
            problems: this.state.folderProblems.filter(currentProblem => {
              let flag = true;
              tags.forEach(currentTag => {
                flag &= currentProblem.tags.includes(currentTag.trim());
              });
              return flag;
            })
          });
          break;
        }
        default:
          console.log('Something is wrong.');
      }
    }
  }

  onChangeCheckBox(e) {
    this.setState({
      showDifficulty: !this.state.showDifficulty
    });
  }

  onClickSortByName() {
    let order = true;
    if (this.state.sortOption[0] === 'Name') {
      order = !this.state.sortOption[1];
    }

    if (order) {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in ascending order.
      problems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      folderProblems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      allProblems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      this.setState({
        sortOption: ['Name', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    } else {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in descending order.
      problems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      folderProblems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      allProblems.sort((a, b) => {
        if (a.name.toLowerCase() === b.name.toLowerCase()) {
          return 0;
        } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        } else {
          return 1;
        }
      });

      this.setState({
        sortOption: ['Name', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    }
  }

  onClickSortByDate() {
    let order = true;
    if (this.state.sortOption[0] === 'Date') {
      order = !this.state.sortOption[1];
    }

    if (order) {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in ascending order.
      problems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x > y) {
          return 1;
        } else if (x < y) {
          return -1;
        } else {
          return 0;
        }
      });

      folderProblems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x > y) {
          return 1;
        } else if (x < y) {
          return -1;
        } else {
          return 0;
        }
      });

      allProblems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x > y) {
          return 1;
        } else if (x < y) {
          return -1;
        } else {
          return 0;
        }
      });

      this.setState({
        sortOption: ['Date', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    } else {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in descending order.
      problems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x < y) {
          return 1;
        } else if (x > y) {
          return -1;
        } else {
          return 0;
        }
      });

      folderProblems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x < y) {
          return 1;
        } else if (x > y) {
          return -1;
        } else {
          return 0;
        }
      });

      allProblems.sort((a, b) => {
        let x = new Date(a.date), y = new Date(b.date);
        if (x < y) {
          return 1;
        } else if (x > y) {
          return -1;
        } else {
          return 0;
        }
      });

      this.setState({
        sortOption: ['Date', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    }
  }

  onClickSortByDifficulty() {
    let order = true;
    if (this.state.sortOption[0] === 'Difficulty') {
      order = !this.state.sortOption[1];
    }

    if (order) {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in ascending order.
      problems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty < b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      folderProblems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty < b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      allProblems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty < b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      this.setState({
        sortOption: ['Difficulty', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    } else {
      let problems = this.state.problems;
      let folderProblems = this.state.folderProblems;
      let allProblems = this.state.allProblems;

      // Sort in descending order.
      problems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty > b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      folderProblems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty > b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      allProblems.sort((a, b) => {
        if (a.difficulty === b.difficulty) {
          return 0;
        } else if (a.difficulty > b.difficulty) {
          return -1;
        } else {
          return 1;
        }
      });

      this.setState({
        sortOption: ['Difficulty', order],
        problems: problems,
        folderProblems: folderProblems,
        allProblems: allProblems
      });
    }
  }

  deleteProblem(id, folder) {
    console.log("Delete: ", id, folder);

    axios.delete(`http://localhost:${process.env.REACT_APP_BACKEND_SERVER_PORT}/problems/` + id)
      .then(res => {
        console.log(res.data);

        /* If there is only 1 problem in folder then remove that folder too from
        the folders-list */
        if (this.state.problems.length <= 1) {
          this.setState({
            folders: this.state.folders.filter(currentFolder => {
              return currentFolder !== folder;
            }),
            allProblems: this.state.allProblems.filter(currentProblem => {
              return currentProblem._id !== id;
            }),
            error: false
          }, () => {
            this.onChangeFolder('All');
          });
        } else {
          this.setState({
            problems: this.state.problems.filter(currentProblem => {
              return currentProblem._id !== id;
            }),
            folderProblems: this.state.folderProblems.filter(currentProblem => {
              return currentProblem._id !== id;
            }),
            allProblems: this.state.allProblems.filter(currentProblem => {
              return currentProblem._id !== id;
            }),
            error: false
          });
        }
      })
      .catch(err => {
        console.log('Error: ' + err)
        this.setState({ error: true });
      });
  }

  problemList() {
    return this.state.problems.map(currentProblem => {
      return <Problem problem={currentProblem}
        deleteProblem={this.deleteProblem}
        showDifficulty={this.state.showDifficulty}
        setPage={this.props.setPage}
        setId={this.props.setId}
        key={currentProblem._id} />;
    });
  }

  render() {
    return (
      <div className="mt-2 position-relative">
        <ReactTooltip delayShow={400} />
        {/* Folders dropdown, Current-folder, Export button */}
        <div className="nav navbar-nav navbar-dark position-absolute btn-group"
          style={{ right: 58, top: -48 }}>

          {/* Current-folder */}
          <div className="navbar-nav nav form-control px-1 overflow-hidden"
            data-tip="Current Folder"
            data-type="info"
            style={{
              borderRadius: "1rem 0rem 0rem 1rem",
              backgroundColor: '#45545a',
              border: 'none',
              width: 200,
              color: 'white'
            }}>
            <span className="ms-1">
              {
                "(" + this.state.problems.length + ")" + this.state.currentFolder
              }
            </span>
          </div>

          {/* Folders dropdown */}
          <button type="button"
            className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
            id="dropdownMenuSearch"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-reference="parent"
            data-tip="Folders"
            data-type="info"
            style={{
              borderRadius: "0rem 1rem 1rem 0rem",
              border: 'none',
              backgroundColor: '#616d71'
            }}>
            <span className="visually-hidden">Toggle Dropdown</span>
          </button>

          <ul className="dropdown-menu position-absolute"
            aria-labelledby="dropdownMenuSearch">
            <Scrollbars style={{ height: 190, width: '13rem' }}>
              {this.folderList()}
            </Scrollbars>
          </ul>

          {/* Export button */}
          <div className="navbar-nav ms-2 p-1">
            <button type="button"
              data-tip="Export Problems in JSON"
              data-type="info"
              onClick={() => { this.exportJSON() }}
              className="btn nav-link p-0">
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search Bar, Difficutly Checkbox, Sort Option */}
        <div className="my-2">
          {/* Search Bar */}
          <div className="btn-group"
            style={{ width: "236.3px" }}>
            <input className="form-control"
              type={this.state.searchOption[0] === 'Difficulty'
                ? "number"
                : "search"}
              placeholder={this.state.searchOption[0]
                + (this.state.searchOption[0] === 'Tags'
                  ? "(comma-separated)"
                  : "")
                + ((this.state.searchOption[0] === 'Difficulty')
                  ? "(" + (this.state.searchOption[1] ? ">=" : "<=") + ")"
                  : "")}
              aria-label="Search"
              value={this.state.searchValue}
              onChange={this.searchProblem}
              style={{ borderRadius: ".25rem 0rem 0rem .25rem" }}
            />

            <button type="button"
              className="btn btn-secondary dropdown-toggle dropdown-toggle-split"
              id="dropdownMenuSearch"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-reference="parent"
              data-tip="Search by"
              data-type="info">
              <span className="visually-hidden">Toggle Dropdown</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end position-absolute"
              aria-labelledby="dropdownMenuSearch">
              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => {
                    this.setState({
                      searchValue: '',
                      searchOption: ['Name', true],
                      problems: this.state.folderProblems
                    })
                  }}>
                  Name
                </button>
              </li>

              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => {
                    this.setState({
                      searchValue: '',
                      searchOption: ['Link', true],
                      problems: this.state.folderProblems
                    })
                  }}>
                  Link
                </button>
              </li>

              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => {
                    if (this.state.searchOption[0] === 'Difficulty') {
                      this.setState({
                        searchValue: '',
                        searchOption: ['Difficulty', !this.state.searchOption[1]],
                        problems: this.state.folderProblems
                      })
                    }
                    else {
                      this.setState({
                        searchValue: '',
                        searchOption: ['Difficulty', true],
                        problems: this.state.folderProblems
                      })
                    }
                  }}>
                  Difficulty
                  {
                    (this.state.searchOption[0] === 'Difficulty'
                      ? "(" + (this.state.searchOption[1] ? "<=" : ">=") + ")"
                      : "")
                  }
                </button>
              </li>

              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => {
                    this.setState({
                      searchValue: '',
                      searchOption: ['Tags', true],
                      problems: this.state.folderProblems
                    })
                  }}>
                  Tags
                </button>
              </li>
            </ul>
          </div>

          {/* Difficutly Checkbox */}
          <div className="btn-group d-inline-flex border mx-1"
            style={{
              padding: ".32rem 0.75rem",
              borderRadius: "0.25rem",
              width: "128.43px"
            }}>
            <div className="form-check form-switch">
              <input type="checkbox"
                className="form-check-input"
                data-tip="Toggle"
                data-type="info"
                onChange={this.onChangeCheckBox}
                checked={this.state.showDifficulty}>
              </input>
              <label className="form-check-label">Difficulty</label>
            </div>
          </div>

          {/* Sort Option */}
          <div className="dropdown d-inline-flex float-end"
            style={{ width: "68.52px" }}>
            <button type="button"
              className="btn btn-secondary dropdown-toggle"
              id="dropdownSort"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-tip="Sort By"
              data-type="info">
              Sort
            </button>

            <ul className="dropdown-menu dropdown-menu-end position-absolute"
              aria-labelledby="dropdownSort">
              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => { this.onClickSortByName() }}>
                  Name {
                    (this.state.sortOption[0] === 'Name')
                    && (this.state.sortOption[1]
                      ? <BsCaretUpFill />
                      : <BsCaretDownFill />)
                  }
                </button>
              </li>

              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => { this.onClickSortByDate() }}>
                  Date {
                    (this.state.sortOption[0] === 'Date')
                    && (this.state.sortOption[1]
                      ? <BsCaretUpFill />
                      : <BsCaretDownFill />)
                  }
                </button>
              </li>

              <li>
                <button type="button"
                  className="dropdown-item"
                  onClick={() => { this.onClickSortByDifficulty() }}>
                  Difficulty {
                    (this.state.sortOption[0] === 'Difficulty')
                    && (this.state.sortOption[1]
                      ? <BsCaretUpFill />
                      : <BsCaretDownFill />)
                  }
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Problem-list */}
        <Scrollbars style={{ height: 344.35 }}>
          { // Any error?
            this.state.error &&
            <div className="alert alert-warning" role="alert">
              Some Error Occured!!!
            </div>
          }

          {this.problemList()}
        </Scrollbars>
      </div>
    );
  }
}