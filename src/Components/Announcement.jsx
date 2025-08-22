/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import "../Styles/Announcement.css";
import Loading from "./Loading";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRemove } from "@fortawesome/free-solid-svg-icons";
import adminContext from "./adminContext";

function Announcement() {
  // const url = "http://127.0.0.1:8000";
  const url = "https://kmcianbackend.vercel.app";

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [admin, setIsAdmin] = useContext(adminContext);

  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPage: 1,
  });
  const [announcementText, setAnnouncementText] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAnnouncement();
  }, []);


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
        Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
      },
      body: announcementText,
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

  const handleClick = (e) => {
    if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchAnnouncement(e);
    return;
  };

  // fetch the announcement

  const fetchAnnouncement = (e) => {
    setLoading(true);
    // const id = toast.loading("Fetching announcements...");

    fetch(`${url}/api/announcement/${pageInfo.currentPage + 1}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setAnnouncements((prev) => [...prev, ...data.announcements]);
        setPageInfo({
          currentPage: data.currentPage,
          totalPage: data.totalPage,
        });
        setLoading(false);
        // hide the more button if current page = total page

        if (data.currentPage == data.totalPage) e.target.hidden = true;
        // toast.success("Completed", { id: id });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // toast.error(error.message, { id: id });
      });
  };

  //------------------- delete announcement --------------

  const handleDeleteAnnouncement = (id) => {
    const loadId = toast.loading("Deletion in progress.");

    fetch(`${url}/api/announcement`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then(async (response) => {
        const data = await response.json();
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
        {announcements[0] && (
          <>
            {" "}
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
                      <FontAwesomeIcon icon={faRemove}></FontAwesomeIcon>
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
          </>
        )}

        {admin && (
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
        )}
      </div>
    </>
  );
}

export default Announcement;
