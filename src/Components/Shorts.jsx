/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import "../Styles/short.css";
import adminContext from "./adminContext";
import RoundMotion from "./RoundMotion";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faPlus,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function ShortsFeed() {
  const [shorts, setShorts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [isAdmin, setIsAdmin] = useContext(adminContext);
  const [show, setShow] = useState(false);
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(1);

  const videoRefs = useRef({});
  const observerRef = useRef(null);

  // const BASE_URL = "http://172.21.185.27:8000";
  const BASE_URL = "https://kmcianbackend.vercel.app";

  const toggle = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  // ================get signed url=======================

  let loadId = "";

  const getSignedUrl = async () => {
    loadId = toast.loading("getting signed url ");

    try {
      const signRes = await axios.get(`${BASE_URL}/api/storage/signupload`);

      if (signRes.status == 200) {
        // toast.success(signRes.message || "Got the signed url", { id: loadId });
        return signRes;
      } else {
        return toast.error(signRes.message || "failed", { id: loadId });
      }
    } catch (error) {
      console.log("error in getting signed url", error);
      toast.error(error, { id: loadId });
    }
  };

  // ================upload-shorts======================

  const upload = async (e) => {
    e.preventDefault();

    const file = fileRef.current.files[0];
    if (!file) return;
    if (file && file.size > 40 * 1024 * 1024) {
      return toast.error("File size must be under 40MB");
    }
    // console.log(signedUrl, "inside upload vids");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("caption", "testing");

    const signedUrl = await getSignedUrl();
    if (!signedUrl) return toast.error("no signed url", { id: loadId });
    const { signature, timestamp, cloudName, apiKey, folder } = signedUrl.data;

    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    // toast.loading("Uploading... ", {id: loadId});

    try {
      setIsUploading(true);
      const uploadRes = await axios.post(`${cloudinaryUrl}`, formData, {
        timeout: 0,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            toast.loading(`Uploading... ${percentage}%`, { id: loadId });
            setProgress(percentage);
          }
        },
      });

      if (uploadRes.status === 200) {
        try {
          const data = await axios.post(
            `${BASE_URL}/api/storage/uploadmetadata`,
            {
              videoUrl: uploadRes.data.secure_url,
              publicId: uploadRes.data.public_id,
              size: uploadRes.data.bytes,
              duration: uploadRes.data.duration,
            }
          );

          if (data.status == 201)
            return toast.success(data.message, { id: loadId });
          else return toast.error("error in uploading metadata", data.message);
        } catch (error) {
          console.log(error);
          toast.error(error.message, { id: loadId });
        }

        setProgress(0);
      } else {
        toast.error(uploadRes.message || "Upload failed", { id: loadId });
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out.", { id: loadId });
      } else if (error.response) {
        toast.error(error.response.data?.message || "Server error", {
          id: loadId,
        });
      } else {
        toast.error("Network error occurred.", { id: loadId });
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

      if (id === !activeId) {
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

  // ===================================handle click on video

  const handleClick = (id) => {
    setShow(false);
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
            {/* <div
              className="delete-button-container"
              onClick={(e) => handleDelete(e, short._id)}
            >
              <FontAwesomeIcon icon={faRemove}></FontAwesomeIcon>
            </div> */}
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
                objectFit: "cover",
              }}
            />

            <div className="upload-video-container">
              {/* <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon> */}
              <div className="upload-video-button-container">
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={toggle}
                ></FontAwesomeIcon>
              </div>

              {show && (
                <div className="upload-video-fields-container">
                  <input type="file" id="file-input" ref={fileRef} />
                  <input type="text" placeholder="Title" />
                  <FontAwesomeIcon
                    icon={faCloudArrowUp}
                    id="upload-button"
                    onClick={upload}
                  ></FontAwesomeIcon>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
