/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../Styles/Query.css";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import RoundMotion from "./RoundMotion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faTrash } from "@fortawesome/free-solid-svg-icons";
import adminContext from "./adminContext";

export default function Query() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [query, setQuery] = useState([]);

  const pageInfoRef = useRef({ currentPage: 1, totalPage: 1 });

  const [userQuery, setUserQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [reply, setReply] = useState([]);

  const [qId, setQId] = useState("");

  const [userReply, setUserReply] = useState("");

  const [user] = useContext(adminContext);

  const controllerRef = useRef(null);

  useEffect(() => {
    pageInfoRef.current.currentPage = 1;
    fetchQuery();
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      setQuery([]);
    };
  }, []);

  // ===============more button click========

  const handleMoreClick = () => {
    const { currentPage, totalPage } = pageInfoRef.current;

    if (currentPage < totalPage) {
      pageInfoRef.current.currentPage += 1;
      fetchQuery();
    }
  };

  // ===========query change=============

  const handleUserQueryChange = (e) => {
    setUserQuery(e.target.value);
  };

  // ============handle submit button click==============

  const handleSubmitQueryButtonClick = (e) => {
    postQuery(e);
  };

  // ============handle reply change===========

  const handleUserReplyChange = (e) => {
    setUserReply(e.target.value);
  };

  // ============handle reply submit button click=========

  const handleReplySubmitButtonClick = async (e) => {
    e.stopPropagation()
    postReply(qId);
  };

  // ==========reply button click==============

  const replyButtonClick = (e, queryId) => {
    if (qId) {
      setQId(null);
      return;
    }
    e.stopPropagation();
    setQId(queryId);
    fetchReply(queryId);
  };

  //================== fetch query===============

  const fetchQuery = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const loadId = toast.loading("Fetching queries...");
    try {
      const res = await fetch(
        `${url}/api/query/${pageInfoRef.current.currentPage}`,
        { signal: controllerRef.current.signal },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "An error occurred");
      }
      setQuery((prev) => [...prev, ...data.query]);
      pageInfoRef.current.currentPage = data.currentPage;
      pageInfoRef.current.totalPage = data.totalPage;
      toast.success("Fetched successfully", { id: loadId });
      return;
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("error in fetching query", error);
        toast.error(error.message, { id: loadId });
      }
    }
  };

  //====================== Post query====================
  const postQuery = async (e) => {
    e.stopPropagation();

    if (!userQuery.trim()) {
      return toast.error("Query cannot be empty");
    }

    setIsLoading(true);
    const loadId = toast.loading("Posting query...");

    try {
      const res = await fetch(`${url}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: userQuery.trim(),
          name: user?.username || "unknown person",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to post query");
      }

      setQuery((prev) => [data.data, ...prev]);
      setUserQuery("");
      toast.success(data.message, { id: loadId });
    } catch (error) {
      console.error("error posting query:", error);
      toast.error(error.message, { id: loadId });
    } finally {
      setIsLoading(false);
    }
  };

  // =============== fetch reply ==========================
  const fetchReply = async (queryId) => {
    const loadId = toast.loading("Fetching replies...");

    try {
      const res = await fetch(`${url}/api/reply/${queryId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setReply(data);

      toast.success("Fetched successfully", { id: loadId });
    } catch (error) {
      console.log("error in fetching reply", error);

      toast.error(error.message, { id: loadId });
    }
  };

  //========================== post reply =================
  const postReply = async (queryId) => {
    if (!userReply.trim()) {
      return toast.error("Reply cannot be empty");
    }

    const loadId = toast.loading("Posting reply...");

    try {
      const res = await fetch(`${url}/api/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryId,
          content: userReply.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUserReply("");
      toast.success(data.message, { id: loadId });
      setReply((prev) => [...prev, data.reply]);
    } catch (error) {
      console.log("error in posting reply", error);
      toast.error(error.message, { id: loadId });
    }
  };

  //------------- data format-----------------

  const formatData = (text = "") => {
    return text.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  // =========delete query=================
  const handleDeleteQuery = async (e, queryId) => {
    const loadId = toast.loading("Deleting query...");

    try {
      const res = await fetch(`${url}/api/query`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setQuery((prev) => prev.filter((q) => q._id !== queryId));

      toast.success(data.message, { id: loadId });
    } catch (error) {
      console.log("error in deleting query", error);
      toast.error(error.message, { id: loadId });
    }
  };

  // delete button show or hide control function

  // =========================================================================

  return (
    <>
      {isLoading && <RoundMotion></RoundMotion>}

      {
        <div
          className="discussion-container"
          onClick={(e) => {
            e.stopPropagation();
            setReply([]);
            setQId(null);
          }}
        >
          {query &&
            query.map((data) => (
              <div className="query-container" key={data["_id"]}>
                <div className="query-header">
                  <span className="time-stamp">
                    {new Date(data.createdAt).toLocaleString()}
                  </span>
                  <div className="query-header-side-menu">
                    {user.userId && (
                      <div className={"delete-button-container"}>
                        <button
                          onClick={(e) => handleDeleteQuery(e, data["_id"])}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            data-value={data["_id"]}
                          />
                        </button>
                      </div>
                    )}
                    <div className="reply-button-container">
                      <FontAwesomeIcon
                        icon={faReply}
                        style={{ color: "#ffffff" }}
                        onClick={(e) => replyButtonClick(e, data._id)}
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
                          onChange={(e) => handleUserReplyChange(e)}
                          value={userReply}
                          onClick={(e) => e.stopPropagation()}
                        ></textarea>
                        <button
                          className="button"
                          onClick={(e) => handleReplySubmitButtonClick(e)}
                          disabled={isLoading}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}

          <>
            <div className="button-container">
              <button
                onClick={(e) => handleMoreClick(e)}
                id="more-button"
                className="button"
                disabled={isLoading}
                hidden = {pageInfoRef.current.currentPage == pageInfoRef.current.totalPage}
              >
                {query[0] ? "more..." : "Show queries"}
              </button>
            </div>

            <div className="input-container">
              <textarea
                placeholder="Query"
                value={userQuery}
                onChange={(e) => handleUserQueryChange(e)}
              ></textarea>
              <button
                onClick={(e) => handleSubmitQueryButtonClick(e)}
                disabled={isLoading}
                className="button"
              >
                Submit
              </button>
            </div>
          </>
        </div>
      }
    </>
  );
}
