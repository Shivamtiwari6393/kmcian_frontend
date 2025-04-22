/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../Styles/Query.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faReply,
  faCross,
  faRemove,
  faBoltLightning,
  faRemoveFormat,
} from "@fortawesome/free-solid-svg-icons";
import { faBomb } from "@fortawesome/free-solid-svg-icons/faBomb";

export default function Query() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [query, setQuery] = useState([]);
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

  // ===============more button click========

  const handleMoreClick = (e) => {
    console.log(pageInfo);

    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchQuery(e);
    return;
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
    fetch(`${url}/api/query/${pageInfo.currentPage + 1}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "An error occurred");
        setQuery((prev) => [...prev, ...data.query]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });
        setIsLoading(false);

        // hide the more button if current page = total page

        if (data.currentPage == data.totalPage) e.target.hidden = true;
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
        toast.success(data.message, { id: loadId });
      })
      .catch((error) => {
        // setIsLoading(false);
        toast.error(error.message, { id: loadId });
      });
  };

  // =============== fetch reply ==========================

  const fetchReply = (queryId) => {
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
      <div className="discussion-container">
        {query.map((data) => (
          <>
            <div className="query-container" key={data["_id"]}>
              <div className="query-header" onDoubleClick={handledeleteShow}>
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
                        onClick={replyButtonClick}
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
                <p className="query">{formatData(data.content)}</p>
              </div>
              {data["_id"] === qId && (
                <>
                  <div className="reply-container">
                    <div className="cancel-button-container">
                      <button onClick={() => setReply("") || setQId("")}>
                        <FontAwesomeIcon
                          icon={faRemove}
                          style={{ color: "#ffffff" }}
                          onClick={replyButtonClick}
                          data-value={data["_id"]}
                        />
                      </button>
                    </div>

                    {reply !== "" &&
                      reply.map((data) => (
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
          <button onClick={handleSubmitQueryButtonClick} disabled={!userQuery}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
