import "../Styles/Discussion.css";
import reply from "../assets/reply.png";
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

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const handleClick = () => {
    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchQuery();
    return;
  };

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
      .catch((error) => toast.error(error.message));
  };

  const handleSubmitClick = () => {
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

  const handleReply = () => {
    toast.error("This feature will be available soon. Please try later.");
  };

  return (
    <>
      {isLoading && <Loading></Loading>}
      <div className="discussion-container">
        {query.map((data, index) => (
          <>
            <div className="query-container" key={index}>
              <div className="query-header">
                <span className="time-stamp">
                  {" "}
                  {new Date(data.createdAt).toLocaleString()}
                </span>
                <div className="reply-button-container">
                  <img src={reply} alt="reply" onClick={handleReply} />
                </div>
              </div>
              <div className="query-body">
                <p className="query">{data.content}</p>
              </div>
            </div>
          </>
        ))}

        <div className="button-container">
          <button onClick={handleClick}>
            {" "}
            {query[0] ? "more..." : "Show queries"}
          </button>
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Query"
            value={userQuery}
            onChange={handleInputChange}
          />
          <button onClick={handleSubmitClick}>Submit</button>
        </div>
      </div>
    </>
  );
}
