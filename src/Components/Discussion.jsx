import "../Styles/Discussion.css";
import replyImg from "../assets/reply.png";
import { useState } from "react";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function Discussion() {
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

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  // ===============more button click========

  const handleMoreClick = () => {
    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchQuery();
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

  const fetchQuery = () => {
    setIsLoading(true);
    fetch(`${url}/api/query/${pageInfo.currentPage + 1}`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((data) => {
            throw new Error(data.message);
          });

        return res.json();
      })
      .then((data) => {
        setQuery((prev) => [...prev, ...data.query]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  //====================== Post query====================

  const postQuery = () => {
    setIsLoading(true);
    fetch(`${url}/api/query`, {
      method: "POST",
      body: JSON.stringify({ content: userQuery, name: "unknown person" }),
    })
      .then((res) => {
        if (!res.ok)
          return res.json().then((data) => {
            throw new Error(data.message);
          });

        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        toast.success(data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  // =============== fetch reply ==========================

  const fetchReply = (queryId) => {
    setIsLoading(true);
    fetch(`${url}/api/reply/${queryId}`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((data) => {
            throw new Error(data.message);
          });

        return res.json();
      })
      .then((data) => {
        setReply(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  //========================== post reply =================

  const postReply = (queryId) => {
    setIsLoading(true);
    fetch(`${url}/api/reply`, {
      method: "POST",
      body: JSON.stringify({
        queryId: queryId,
        content: userReply,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        toast.success(data.message);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
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
        Authorization: `Bearer ${localStorage.getItem("kmciantoken")}`,
      },
    })
      .then((response) => {
        if (!response.ok)
          return response.json().then((data) => {
            throw new Error(data.message);
          });

        return toast.success("Query deleted successfully", { id: loadId });
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
        {reply && (
          <>
            <div className="reply-container">
              <div className="cancel-button-container">
                <button onClick={() => setReply(!reply)}>X</button>
              </div>
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
            </div>
          </>
        )}
        {query.map((data) => (
          <>
            <div className="query-container" key={data["_id"]}>
              <div className="query-header" onDoubleClick={handledeleteShow}>
                <span className="time-stamp">
                  {new Date(data.createdAt).toLocaleString()}
                </span>
                <div
                  className={
                    show
                      ? "delete-button-container"
                      : "delete-button-container-hide"
                  }
                >
                  <button onClick={() => handleDeleteQuery(data._id)}>
                    ❌
                  </button>
                </div>
                <div className="reply-button-container">
                  <img
                    src={replyImg}
                    alt="reply"
                    onClick={replyButtonClick}
                    data-value={data["_id"]}
                  />
                </div>
              </div>
              <div className="query-body">
                <p className="query">{formatData(data.content)}</p>
              </div>
            </div>
          </>
        ))}

        <div className="button-container">
          <button onClick={handleMoreClick}>
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
