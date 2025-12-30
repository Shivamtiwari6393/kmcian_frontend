/* eslint-disable no-unused-vars */
// import { useState } from "react";
import toast from "react-hot-toast";
import "../Styles/UploadVideo.css";
import { useRef, useState } from "react";
import axios from "axios";

function UploadVideo() {
  // const [Signedurl, setSignedUrl] = useState(null);
  const fileRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(1);

  // const url = "http://127.0.0.1:8000";
  // const url = "http://172.21.185.27:8000";

  const url = "https://kmcianbackend.vercel.app";

  //   -----------------------upload--------------------------

  const getSignedUrl = async () => {
    const loadId = toast.loading("getting signed url ");

    try {
      const signRes = await axios.get(`${url}/api/storage/signupload`);

      if (signRes.status == 200) {
        toast.success(signRes.message || "Got the signed url", { id: loadId });
        return signRes;
      } else {
        return toast.error(signRes.message || "failed", { id: loadId });
      }
    } catch (error) {
      console.log("error in getting signed url", error);
      toast.error(error, { id: loadId });
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    const signedUrl = await getSignedUrl();

    if (!signedUrl) return toast.error("no signed url", { id: loadId });

    const { signature, timestamp, cloudName, apiKey, folder } = signedUrl.data;

    console.log(signedUrl, "inside upload vids");

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    const formData = new FormData();
    const file = fileRef.current.files[0];
    if (!file) return;

    formData.append("file", file);
    // formData.append("caption", "testing");
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);
    const loadId = toast.loading("Uploading... ");

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
          const data = await axios.post(`${url}/api/storage/uploadmetadata`, {
            videoUrl: uploadRes.data.secure_url,
            publicId: uploadRes.data.public_id,
            size: uploadRes.data.bytes,
            duration: uploadRes.data.duration,
          });

          if (data.status == 201) return   toast.success(data.message, { id: loadId });
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

  return (
    <div className="upload-video-component">
      <div className="form">
        <form onSubmit={upload}>
          <h2>UploadVideo</h2>

          <div className="title-container">
            <label htmlFor="title">Title : </label>
            <input type="text" name="title" id="title" />
          </div>

          <div className="upload-input-container">
            <label htmlFor="video">File : </label>
            <input type="file" name="video" id="video" ref={fileRef} />
          </div>

          <div className="submit-button-container">
            <button type="submit">Submit</button>
          </div>
        </form>
        {/* 
        <div className="activate-button-container">
          <button onClick={getSignedUrl}>Activate</button>
        </div> */}
      </div>
    </div>
  );
}
export default UploadVideo;
