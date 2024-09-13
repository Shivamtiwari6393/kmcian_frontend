/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import "../Styles/Announcement.css";
import Loading from "./Loading";
import toast from "react-hot-toast";

function Announcement() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 1,
  });
  const [announcementText, setAnnouncementText] = useState("");

  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  useEffect(() => {
    setTimeout(() => {
      const value = localStorage?.getItem("kmciantoken");
      if (value) {
        const element = document.getElementById("announcement-text");
        if (element) element.style.display = "flex";
      }
    }, 0);
  });

  // handle input  change

  const handleInputChange = (e) => {
    setAnnouncementText(e.target.value);
  };

  // handle announcement submit

  const handleAnnouncementSubmit = () => {
    setLoading(true);
    fetch(`${url}/api/announcement`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("kmciantoken")}`,
      },
      body: JSON.stringify(announcementText),
    })
      .then((res) => {
        if (!res.ok)
          return res.json().then((data) => {
            throw new Error(data.message);
          });

        return res.json();
      })
      .then((data) => {
        setLoading(false);
        toast.success(data.message);
      })
      .catch((error) => {
        setLoading(false);

        toast.error(error.message);
      });
  };

  // handle more/announcement button click

  const handleClick = () => {
    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchh();

    return;
  };

  // fetch the announcement

  const fetchh = () => {
    setLoading(true);

    fetch(`${url}/api/announcement/${pageInfo.currentPage + 1}`)
      .then((res) => {
        if (res.status != 200) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        setAnnouncements((prev) => [...prev, ...data.announcements]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  return (
    <>
      <div
        className={
          show ? "announcement-container-in" : "announcement-container"
        }
      >
        {loading && <Loading></Loading>}
        {console.log(announcements, "wanna")}
        <div className="announcements">
          {announcements?.map((Announcement, index) => (
            <>
              <div className="announcement" key={index}>
                <p>{Announcement.content}</p>
                <div className="time-container">
                  <span>
                    {new Date(Announcement.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="button-container">
          <button onClick={handleClick}>
            {announcements[0] ? "more..." : "Show Announcements"}
          </button>
        </div>

        <div className="announcement-text-container" id="announcement-text">
          <input
            type="text"
            name="announcementText"
            placeholder="Annoncement"
            onChange={handleInputChange}
          />
          <button type="submit" onClick={handleAnnouncementSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Announcement;
