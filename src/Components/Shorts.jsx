/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import "../Styles/short.css";
import adminContext from "./adminContext";
import RoundMotion from "./RoundMotion";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCross,
  faDeleteLeft,
  faRemove,
  faWifiStrong,
} from "@fortawesome/free-solid-svg-icons";
export default function ShortsFeed() {
  const [shorts, setShorts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [isAdmin, setIsAdmin] = useContext(adminContext);

  const videoRefs = useRef({});
  const observerRef = useRef(null);

  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://kmcianbackend.vercel.app";

  const fetchShorts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const url = cursor
        ? `${BASE_URL}/api/storage?cursor=${cursor}`
        : `${BASE_URL}/api/storage`;

      const res = await fetch(url);
      const data = await res.json();

      setShorts((prev) => [...prev, ...data.shorts]);
      setCursor(data.nextCursor);
      setHasMore(Boolean(data.nextCursor));
    } catch (err) {
      console.error("Failed to fetch shorts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.id;
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActiveId(id);
          }
        });
      },
      { threshold: 0.6 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observerRef.current.observe(video);
    });

    return () => observerRef.current.disconnect();
  }, [shorts]);

  //-------------------------=============== -------------------------------

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return;

      if (id === activeId) {
        video.play().catch((err) => {
          "err in playing video", console.log(err);
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeId]);

  const handleScroll = (e) => {
    const bottomReached =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;

    if (bottomReached) fetchShorts();
  };

  const handleClick = (id) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) video.play();
    else video.pause();
  };

  const handleDelete = async (e, shortId) => {
    e.stopPropagation();
    const loadId = toast.loading("Deletion in progress...");

    try {
      const response = await fetch(
        `${BASE_URL}/api/storage/delete/${shortId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) return toast.success(data.message, { id: loadId });
      toast.error(data.message || "Delete failed", { id: loadId });
    } catch (error) {
      console.log(error);
      toast.error("error in deleting the short", { id: loadId });
    }
  };

  return (
    <>
      {loading && <RoundMotion></RoundMotion>}

      {isAdmin ? (
        <div
          className="short-container"
          onScroll={handleScroll}
          style={{
            height: "90vh",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
          }}
        >
          {shorts.map((short) => (
            <div
              className="video-container"
              key={short._id}
              style={{ scrollSnapAlign: "start", height: "90vh" }}
            >
              <div
                className="delete-button-container"
                onClick={(e) => handleDelete(e, short._id)}
              >
                <FontAwesomeIcon icon={faRemove}></FontAwesomeIcon>
              </div>
              <video
                ref={(el) => (videoRefs.current[short._id] = el)}
                data-id={short._id}
                src={short.videoUrl}
                onClick={() => handleClick(short._id)}
                loop
                playsInline
                controls={false}
                style={{
                  width: "100%",
                  height: "100%",
                  // objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        "please login"
      )}
    </>
  );
}
