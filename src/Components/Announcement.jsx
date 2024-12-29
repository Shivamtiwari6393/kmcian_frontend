/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import "../Styles/Announcement.css";
import Loading from "./Loading";
import toast from "react-hot-toast";

function Announcement() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 1,
  });
  const [announcementText, setAnnouncementText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const value = sessionStorage?.getItem("kmcianToken");
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
      headers : {
        'Authorization' : `Bearer ${sessionStorage.getItem('kmcianToken')}`
      },
      body: JSON.stringify(announcementText),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
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
    const id = toast.loading("fetching announcements...");


    fetch(`${url}/api/announcement/${pageInfo.currentPage + 1}`)
      .then(async(res) => {
        const data = await res.json()
        if(!res.ok) throw new Error(data.message);
        setAnnouncements((prev) => [...prev, ...data.announcements]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });
        setLoading(false);
        toast.success("fetching completed", {id: id})
        })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message, {id: id});
      });
  };

  //------------------- delete announcement --------------

  const handleDeleteAnnouncement = (id) => {
    const loadId = toast.loading("Deletion in progress.");

    fetch(`${url}/api/announcement`, {
      method: "DELETE",
      headers : {
        'Authorization' : `Bearer ${sessionStorage.getItem('kmcianToken')}`
      },
      body: JSON.stringify({ id: id }),
    })
      .then(async(response) => {

        const data = await response.json()
        if (!response.ok) throw new Error(data.message);
        toast.success(data.message || "Announcement deleted", { id: loadId });
      })
      .catch((error) => toast.error(error.message, { id: loadId }));
  };

  return (
    <>
      <div
        className={
          show ? "announcement-container-in" : "announcement-container"
        }
      >
        {loading && <Loading></Loading>}
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
                <button
                  onClick={() => {
                    handleDeleteAnnouncement(Announcement._id);
                  }}
                  data-value={`{"id": ${Announcement._id}}`}
                  className="announcement-delete-button"
                >
                  ❌
                </button>
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
          <button
            type="submit"
            disabled={!announcementText}
            onClick={handleAnnouncementSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default Announcement;
