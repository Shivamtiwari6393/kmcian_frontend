/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import { useEffect, useRef, useState } from "react";
import { useContext } from "react";

import "../Styles/short.css";
import adminContext from "./adminContext";
import RoundMotion from "./RoundMotion";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faPlay,
  faPlus,
  faTrash,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function ShortsFeed() {
  const [shorts, setShorts] = useState([]);
  const [cursor, setCursor] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [user] = useContext(adminContext);
  const [show, setShow] = useState(false);
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(1);
  const loadIdRef = useRef(null);
  const [play, setPlay] = useState({});

  const videoRefs = useRef({});
  const observerRef = useRef(null);
  // const BASE_URL = "http://172.21.185.27:8000";
  // const BASE_URL = "http://127.0.0.1:8000";
  const BASE_URL = "https://kmcianbackend.vercel.app";

  const toggle = (e) => {
    e.stopPropagation();
    setShow((prev) => !prev);
  };

  const fullscreen = (e, id) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;
    video.requestFullscreen();
    video.webkitRequestFullscreen();
  };

  // ================get signed url=======================

  const getSignedUrl = async () => {
    loadIdRef.current = toast.loading("getting signed url", {
      id: loadIdRef.current,
    });

    try {
      const signRes = await axios.get(`${BASE_URL}/api/shorts/v1/signupload`);

      if (signRes.status == 200) {
        // toast.success(signRes.message || "Got the signed url", { id: loadId });
        return signRes;
      } else {
        return toast.error(signRes.message || "failed", {
          id: loadIdRef.current,
        });
      }
    } catch (error) {
      console.log("error in getting signed url", error);
      toast.error(error, { id: loadIdRef.current });
    }
  };

  // ================upload-shorts======================

  const upload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = fileRef.current.files[0];
    // console.log(file);
    if (!file) return;
    if (file && file.size > 100 * 1024 * 1024) {
      return toast.error(
        `File size ${(file.size / (1024 * 1024)).toFixed(
          1,
        )}MB, it must be under 100MB`,
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    // formData.append("caption", "testing");

    const signedUrl = await getSignedUrl();
    if (!signedUrl)
      return toast.error("no signed url", { id: loadIdRef.current });
    const { signature, timestamp, cloudName, apiKey, folder } = signedUrl.data;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;

    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    toast.loading("Uploading... ", { id: loadIdRef.current });

    try {
      setIsUploading(true);
      const uploadRes = await axios.post(`${cloudinaryUrl}`, formData, {
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            toast.loading(`Uploading... ${percentage}%`, {
              id: loadIdRef.current,
            });
            setProgress(percentage);
          }
        },
      });

      if (uploadRes.status === 200) {
        try {
          toast.loading("Posting metadata...", { id: loadIdRef.current });
          const data = await axios.post(
            `${BASE_URL}/api/shorts/uploadmetadata`,
            {
              videoUrl: uploadRes.data.secure_url,
              publicId: uploadRes.data.public_id,
              size: uploadRes.data.bytes,
              duration: uploadRes.data.duration,
              show: user?.role === "user" || !user.userId ? 1 : 2,
              title: "",
              userId: user?.userId,
            },
          );

          if (data.status == 201) {
            fileRef.current.value = "";
            return toast.success(data.message || "uploaded", {
              id: loadIdRef.current,
            });
          } else
            return toast.error("error in uploading metadata", data.message);
        } catch (error) {
          console.log(error);
          toast.error(error.message, { id: loadIdRef.current });
        }

        setProgress(0);
      } else {
        toast.error(uploadRes.message || "Upload failed", {
          id: loadIdRef.current,
        });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out.", { id: loadIdRef.current });
      } else if (error.response) {
        toast.error(error.response.data?.message || "Server error", {
          id: loadIdRef.current,
        });
      } else {
        toast.error("Network error occurred.", { id: loadIdRef.current });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // ====================short meta-data fetch==============================

  const fetchShorts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const url = `${BASE_URL}/api/shorts/v2?cursor=${cursor}`;

      let res = null;

      if (user.userId) {
        res = await fetch(`${BASE_URL}/api/shorts/v3?cursor=${cursor}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
          },
        });

        if (!res.ok) res = await fetch(url);
      } else {
        res = await fetch(url);
      }

      const data = await res.json();

      if (res.ok) {
        setShorts((prev) => [...prev, ...data.shorts]);
        setCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
      } else return toast.error(data.message);
    } catch (err) {
      console.error("Failed to fetch shorts", err);
    } finally {
      setLoading(false);
    }
  };

  //======initial shorts metadata fetch

  useEffect(() => {
    fetchShorts();
  }, []);

  // ================== intersection observer ======================

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (
              !mostVisible ||
              entry.intersectionRatio > mostVisible.intersectionRatio
            ) {
              mostVisible = entry;
            }
          }
        });

        if (mostVisible) {
          setActiveId(mostVisible.target.dataset.id);
        }
      },
      { threshold: 0.6 },
    );
    return () => observerRef.current.disconnect();
  }, []);

  // =============== register video to observe =================

  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.dataset.observed) {
        observer.observe(video);
        video.dataset.observed = "true";
      }
    });
  }, [shorts]);

  // ===================== play control ==================

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (!video) return;

      if (id === activeId) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeId]);

  // ============ handle scroll ==========================

  const handleScroll = (e) => {
    const bottomReached =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;

    if (bottomReached) fetchShorts();
  };

  // ===================================handle click on video=============================

  const handleClick = (id) => {
    setShow(false);
    const video = videoRefs.current[id];
    if (!video) return;
    if (video.paused)
      video.play().catch((err) => {
        alert(err);
      });
    else video.pause();
  };

  const cloudinaryVideoUrl = (publicId) => {
    return (
      `https://res.cloudinary.com/kmcian/video/upload/` +
      `so_0,c_fill,br_800k,f_auto,q_auto,vc_auto/` +
      `${publicId}`
    );
  };

  // =================== delete short ======================

  const handleDelete = async (e, shortId) => {
    e.stopPropagation();
    const loadId = toast.loading("Deletion in progress...");

    try {
      const response = await fetch(`${BASE_URL}/api/shorts/delete/${shortId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("kmcianToken")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setShorts(() => shorts.filter((short) => short._id != shortId));
        return toast.success(data.message, { id: loadId });
      }
      toast.error(data.message || "Delete failed", { id: loadId });
    } catch (error) {
      console.log(error);
      toast.error("error in deleting the short", { id: loadId });
    }
  };

  return (
    <>
      {loading && <RoundMotion></RoundMotion>}

      <div className="short-container" onScroll={handleScroll}>
        <div className="upload-video-container">
          {/* <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> */}
          <div className="upload-video-plus-button-container">
            <FontAwesomeIcon icon={faPlus} onClick={toggle}></FontAwesomeIcon>
          </div>

          {show && (
            <div className="upload-video-fields-container">
              <input
                type="file"
                id="file-input"
                ref={fileRef}
                multiple={false}
                accept="video/*"
              />
              <input type="text" placeholder="Title" />
              <FontAwesomeIcon
                icon={faCloudArrowUp}
                id="upload-button"
                onClick={!isUploading ? upload : undefined}
              ></FontAwesomeIcon>
            </div>
          )}
        </div>

        {shorts?.map((short) => (
          <div className="video-container" key={short._id}>
            <div className="short-control-button-container">
              <FontAwesomeIcon
                id="fullscreen-button"
                icon={faVectorSquare}
                onClick={(e) => fullscreen(e, short._id)}
              ></FontAwesomeIcon>
              {user.userId && user.role != "user" && (
                <FontAwesomeIcon
                  id="delete-button"
                  icon={faTrash}
                  onClick={(e) => handleDelete(e, short._id)}
                ></FontAwesomeIcon>
              )}
            </div>

            {!play[short._id] && (
              <div className="play-button">
                <FontAwesomeIcon
                  id="fullscreen-button"
                  icon={faPlay}
                ></FontAwesomeIcon>
              </div>
            )}

            <video
              ref={(el) => (videoRefs.current[short._id] = el)}
              data-id={short._id}
              src={cloudinaryVideoUrl(short.publicId)}
              onClick={() => handleClick(short._id)}
              loop
              playsInline
              controls={false}
              controlsList="nodownload"
              disablePictureInPicture
              onPlay={() =>
                setPlay((prev) => ({ ...prev, [short._id]: true }))
              }
              onPause={() => setPlay((p) => ({ ...p, [short._id]: false }))}
            />
          </div>
        ))}
      </div>
    </>
  );
}
