/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext, useRef } from "react";
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
  const [admin] = useContext(adminContext);

  const pageInfoRef = useRef({ currentPage: 1, totalPage: 1 });

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

  const handleAnnouncementSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${url}/api/announcement`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        },
        body: announcementText,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      setAnnouncements((prev) => [data.data, ...prev]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // handle more/announcement button click

  const handleMoreButtonClick = (e) => {
    // if (pageInfo.currentPage + 1 <= pageInfo.totalPage) fetchAnnouncement(e);
    pageInfoRef.current.currentPage += 1;
    console.log(pageInfoRef.current.currentPage);

    if (pageInfoRef.current.currentPage <= pageInfoRef.current.totalPage)
      fetchAnnouncement(e);
    return;
  };

  // fetch the announcement

  const fetchAnnouncement = (e) => {
    setLoading(true);
    // const id = toast.loading("Fetching announcements...");

    fetch(`${url}/api/announcement/${pageInfoRef.current.currentPage}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setAnnouncements((prev) => [...prev, ...data.announcements]);

        (pageInfoRef.current.currentPage = data.currentPage),
          (pageInfoRef.current.totalPage = data.totalPage),
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

  const handleDeleteAnnouncement = async (id) => {
    const loadId = toast.loading("Deletion in progress.");

    try {
      const response = await fetch(`${url}/api/announcement`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id != id)
      );
      toast.success(data.message || "Announcement deleted", { id: loadId });
    } catch (error) {
      toast.error(error.message, { id: loadId });
    }
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
                    { admin &&
                      <button
                        onClick={() => {
                          handleDeleteAnnouncement(Announcement._id);
                        }}
                        data-value={`{"id": ${Announcement._id}}`}
                        className="announcement-delete-button"
                      >
                        <FontAwesomeIcon icon={faRemove}></FontAwesomeIcon>
                      </button>
                    }
                  </div>
                </>
              ))}
            </div>
            <div className="button-container">
              <button onClick={handleMoreButtonClick}>
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
