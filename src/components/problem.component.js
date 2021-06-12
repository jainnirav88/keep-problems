/*global chrome*/
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const Problem = props => {
  return <div className="main card container-fluid py-1 mb-2">

    {/* Problem Link */}
    <div className="col-11">
      <button className="btn btn-link fw-bold text-decoration-none p-0"
        style={{ wordBreak: 'break-all', textAlign: 'left'}}
        onClick={() => { 
          chrome.tabs.create({ url: props.problem.link, active: false });
        }}>
        {
          props.problem.name
          + ((props.problem.difficulty !== 0 && props.showDifficulty)
            ? ("(" + props.problem.difficulty + ")")
            : "")
        }
      </button>
    </div>

    {/* Edit and Delete Button */}
    <div className="hover-btn">

      {/* Edit Button */}
      <button className="btn btn-sm"
        data-tip="edit"
        data-type="info"
        onClick={() => {
          props.setId(props.problem._id);
          props.setPage('Edit');
        }}>
        <BsPencilSquare className="btn-link" />
      </button>

      {/* Delete Button */}
      <button type="button"
        className="btn btn-sm"
        data-dismiss="alert"
        data-tip="Delete"
        data-type="warning"
        onClick={() => {
          props.deleteProblem(props.problem._id, props.problem.folder)
        }}>
        <BsTrash className="btn-link" />
      </button>
    </div>

    {/* Date */}
    <div>
      <span className="fst-italic blockquote-footer">
        {props.problem.date.substring(0, 10).split("-").reverse().join("-")}
      </span>
    </div>

    {/* Folder */}
    <div className="border rounded py-1">
      <span className="container">{props.problem.folder}</span>
    </div>

    <div className="accordion accordion-flush">
      {/* Tags Accordion */}
      <div className="accordion-item">
        <span className="accordion-header"
          id={"headingTags" + props.problem._id}>
          <button type="button"
            className="accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target={"#collapseTags" + props.problem._id}
            aria-expanded="false"
            aria-controls={"collapseTags" + props.problem._id}>
            Tags
          </button>
        </span>

        <div className="accordion-collapse collapse"
          id={"collapseTags" + props.problem._id}
          aria-labelledby={"headingTags" + props.problem._id}>
          <div className="accordion-body border position-relative"
            style={{ minHeight: "2rem" }}>
            <CopyToClipboard text={props.problem.tags}
              onCopy={() => console.log("copied successfully.")}>
              <button style={{ borderRadius: "0rem 0rem 0rem 0.25rem" }}
                className="btn btn-sm btn-outline-primary top-0 end-0 p-0 hover-btn">
                Copy
              </button>
            </CopyToClipboard>

            <div>
              {
                props.problem.tags.map(currentTag => {
                  return <span key={currentTag}
                    className="text-break border rounded d-inline-flex m-1 px-1">
                    {currentTag}
                  </span>
                })
              }
            </div>
          </div>
        </div>
      </div>

      {/* Code Accordion */}
      <div className="accordion-item">
        <span className="accordion-header"
          id={"headingCode" + props.problem._id}>
          <button className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={"#collapseCode" + props.problem._id}
            aria-expanded="false"
            aria-controls={"collapseCode" + props.problem._id}>
            Code
          </button>
        </span>

        <div className="accordion-collapse collapse"
          id={"collapseCode" + props.problem._id}
          aria-labelledby={"headingCode" + props.problem._id}>
          <div className="accordion-body border position-relative"
            style={{ minHeight: "2rem" }}>
            <CopyToClipboard text={props.problem.code}
              onCopy={() => console.log("Copied successfully.")}>
              <button style={{ borderRadius: "0rem 0rem 0rem 0.25rem" }}
                className="btn btn-sm btn-outline-primary top-0 end-0 p-0 hover-btn">
                Copy
              </button>
            </CopyToClipboard>
            <code><pre>{props.problem.code}</pre></code>
          </div>
        </div>
      </div>

      {/* Notes Accordion */}
      <div className="accordion-item">
        <span className="accordion-header"
          id={"headingNotes" + props.problem._id}>
          <button className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={"#collapseNotes" + props.problem._id}
            aria-expanded="false"
            aria-controls={"collapseNotes" + props.problem._id}>
            Notes
          </button>
        </span>

        <div className="accordion-collapse collapse"
          id={"collapseNotes" + props.problem._id}
          aria-labelledby={"headingNotes" + props.problem._id}>
          <div className="accordion-body border position-relative"
            style={{ minHeight: "2rem" }}>
            <CopyToClipboard text={props.problem.notes}
              onCopy={() => console.log("Copied successfully.")}>
              <button style={{ borderRadius: "0rem 0rem 0rem 0.25rem" }}
                className="btn btn-sm btn-outline-primary top-0 end-0 p-0 hover-btn">
                Copy
              </button>
            </CopyToClipboard>
            <pre>{props.problem.notes}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
};

export default Problem;