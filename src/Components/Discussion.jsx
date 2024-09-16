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

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const handleMoreClick = () => {
    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchQuery();
    return;
  };

  const handleUserQueryChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSubmitQueryButtonClick = () => {
    postQuery();
  };

  const handleUserReplyChange = (e) => {
    setUserReply(e.target.value);
  };

  const handleReplySubmitButtonClick = () => {
    postReply(qId);
    setUserReply("");
  };

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
    setIsLoading(true)
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
        setIsLoading(false)
        toast.success(data.message)
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
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
                <button onClick={handleReplySubmitButtonClick} disabled = {!userReply}>Submit</button>
              </div>
              {reply.map((data) => (
                <>
                  <div className="time-stamp">
                    {new Date(data.createdAt).toLocaleString()}
                  </div>
                  <div className="reply-body">
                    <p>{data.content}</p>
                  </div>
                </>
              ))}
            </div>
          </>
        )}
        {query.map((data) => (
          <>
            <div className="query-container" key={data["_id"]}>
              <div className="query-header">
                <span className="time-stamp">
                  {new Date(data.createdAt).toLocaleString()}
                </span>
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
                <p className="query">{data.content}</p>
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
