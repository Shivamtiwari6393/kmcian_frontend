/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../Styles/Query.css";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faRemove } from "@fortawesome/free-solid-svg-icons";

export default function Query() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [query, setQuery] = useState([]);

  const pageInfoRef = useRef({ currentPage: 1, totalPage: 1 });

  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 1,
  });

  const [userQuery, setUserQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [reply, setReply] = useState("");

  const [qId, setQId] = useState("");

  const [userReply, setUserReply] = useState("");

  const [show, setShow] = useState(false);

  useEffect(() => {
    // setIsLoading(true);
    fetchQuery();
    // setIsLoading(false);
  }, []);

  // fetches updated 1st page

  const fetchUpdatedPage = () => {
    setQuery("");
    pageInfo.currentPage = 0;
    fetchQuery();
  };

  // fetch updated reply

  const fetchUpdatedReply = (queryId) => {
    fetchReply(queryId);
  };

  // ===============more button click========

  const handleMoreClick = (e) => {

    if (pageInfoRef.current.currentPage + 1 <= pageInfoRef.current.totalPage) {
      pageInfoRef.current.currentPage += 1;
      fetchQuery(e);
    }
    return;

    // if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchQuery(e);
    // return;
  };

  // ===========query change=============

  const handleUserQueryChange = (e) => {
    setUserQuery(e.target.value);
  };

  // ============handle submit button click==============

  const handleSubmitQueryButtonClick = () => {
    postQuery();
  };

  // ============handle reply change===========

  const handleUserReplyChange = (e) => {
    setUserReply(e.target.value);
  };

  // ============handle reply submit button click=========

  const handleReplySubmitButtonClick = () => {
    postReply(qId);
    setUserReply("");
  };

  // ==========reply button click==============

  const replyButtonClick = (e) => {
    const queryId = e.currentTarget.dataset.value;
    setQId(queryId);
    fetchReply(queryId);
  };

  //================== fetch query===============

  const fetchQuery = (e) => {
    // const loadId = toast.loading("Fetching queries...");

    setIsLoading(true);
    fetch(`${url}/api/query/${pageInfoRef.current.currentPage}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        setQuery((prev) => [...prev, ...data.query]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });

        (pageInfoRef.current.currentPage = data.currentPage),
          (pageInfoRef.current.totalPage = data.totalPage),
          setIsLoading(false);

        // hide the more button if current page = total page
        

        if (data.currentPage == data.totalPage) e.target.hidden = true;
        console.log(data.currentPage, data.totalPage);

        // toast.success("Completed", { id: loadId });
        setIsLoading(false);
        return;
      })
      .catch((error) => {
        setIsLoading(false);
        // toast.error(error.message, { id: loadId });
      });
  };

  //====================== Post query====================

  const postQuery = () => {
    const loadId = toast.loading("Posting query...");

    // setIsLoading(true);
    fetch(`${url}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: userQuery, name: "unknown person" }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        // setIsLoading(false);
        setQuery((prev) => [data.data, ...prev]);
        toast.success(data.message, { id: loadId });
      })
      .catch((error) => {
        // setIsLoading(false);
        toast.error(error.message, { id: loadId });
      });
  };

  // =============== fetch reply ==========================

  const fetchReply = (queryId) => {
    setReply(null);
    const loadId = toast.loading("fetching reply...");

    // setIsLoading(true);
    fetch(`${url}/api/reply/${queryId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        setReply(data);
        toast.success("fetching completed", { id: loadId });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message, { id: loadId });
      });
  };

  //========================== post reply =================

  const postReply = (queryId) => {
    const loadId = toast.loading("posting reply...");

    // setIsLoading(true);
    fetch(`${url}/api/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryId: queryId,
        content: userReply,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        // setIsLoading(false);
        fetchUpdatedReply(queryId);
        toast.success(data.message, { id: loadId });
      })
      .catch((error) => {
        // setIsLoading(false);
        toast.error(error.message, { id: loadId });
      });
  };

  //------------- data format-----------------

  const formatData = (text) => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  // =========delete query=================

  const handleDeleteQuery = (queryId) => {
    const loadId = toast.loading("Query deletion in progress...");

    fetch(`${url}/api/query`, {
      method: "DELETE",
      body: JSON.stringify({ queryId: queryId }),
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        fetchUpdatedPage();
        return toast.success(data.message || "Query deleted successfully", {
          id: loadId,
        });
      })
      .catch((error) => toast.error(error.message, { id: loadId }));
  };

  // delete button show or hide control function

  const handledeleteShow = () => {
    setShow(!show);
  };

  // =========================================================================

  return (
    <>
      {isLoading && <Loading></Loading>}

      {(
        <div className="discussion-container">
          {query &&
            query.map((data) => (
              <>
                <div className="query-container" key={data["_id"]}>
                  <div
                    className="query-header"
                    onDoubleClick={handledeleteShow}
                  >
                    <span className="time-stamp">
                      {new Date(data.createdAt).toLocaleString()}
                    </span>
                    <div className="query-header-side-menu">
                      <div
                        className={
                          show
                            ? "delete-button-container"
                            : "delete-button-container-hide"
                        }
                      >
                        <button onClick={() => handleDeleteQuery(data._id)}>
                          <FontAwesomeIcon
                            icon={faRemove}
                            style={{ color: "#ffffff" }}
                            data-value={data["_id"]}
                          />
                        </button>
                      </div>
                      <div className="reply-button-container">
                        <FontAwesomeIcon
                          icon={faReply}
                          style={{ color: "#ffffff" }}
                          onClick={replyButtonClick}
                          data-value={data["_id"]}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="query-body">
                    <p className="query">
                      {data.content && formatData(data.content)}
                    </p>
                  </div>
                  {reply && data["_id"] === qId && (
                    <>
                      <div className="reply-container">
                        <div className="cancel-button-container">
                          <button
                            onClick={() => setReply(null) || setQId(null)}
                          >
                            <FontAwesomeIcon
                              icon={faRemove}
                              style={{ color: "#ffffff" }}
                              data-value={data["_id"]}
                            />
                          </button>
                        </div>

                        {reply.map((data) => (
                          <>
                            <div className="time-stamp">
                              {new Date(data.createdAt).toLocaleString()}
                            </div>
                            <div className="reply-body">
                              <p>{formatData(data.content)}</p>
                            </div>
                          </>
                        ))}

                        <div className="reply-input-container">
                          <textarea
                            placeholder="Reply"
                            onChange={handleUserReplyChange}
                            value={userReply}
                          ></textarea>
                          <button
                            onClick={handleReplySubmitButtonClick}
                            disabled={!userReply}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ))}

          <div className="button-container">
            <button onClick={handleMoreClick} id="more-button">
              {query[0] ? "more..." : "Show queries"}
            </button>
          </div>

          <div className="input-container">
            <textarea
              placeholder="Query"
              value={userQuery}
              onChange={handleUserQueryChange}
            ></textarea>
            <button
              onClick={handleSubmitQueryButtonClick}
              disabled={!userQuery}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
