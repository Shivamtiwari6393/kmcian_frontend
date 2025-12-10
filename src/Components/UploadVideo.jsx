import { useState } from "react";
import "../Styles/UploadVideo.css";
import { useRef } from "react";

function UploadVideo() {
  const [Signedurl, setSignedUrl] = useState(null);
  const fileRef = useRef(null);

  //   const urrl = "http://127.0.0.1:8000/api/storage";
  const url = "https://kmcianbackend.vercel.app/api/storage";

  const getSignedUrl = async () => {
    const file = fileRef.current["files"][0];
    if (!file.name) {
      alert("Please Select a file");
      return;
    }
    const response = await fetch(
      `${url}/url?fileName=${file.name}&&fileType=${file.type}`
    );
    const data = await response.json();

    if (response.ok) {
        alert("file gen successful")
      setSignedUrl(data["url"][0]);
    } else {
      alert("url generation failed");
    }
    console.log(data["url"][0]);
  };

  //   -----------------------upload--------------------------

  const upload = async () => {
    const file = fileRef.current["files"][0];

    const responsee = await fetch(Signedurl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const dataa = await responsee.json();
    console.log(dataa);

    if (responsee.ok) return alert("file upload");
    else return alert("file upload failed");
  };

  return (
    <div className="upload-video-component">
      <div className="form">
        <form action={`${Signedurl}`} target="_self">
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
            <button type="submit" onClick={upload}>
              Submit
            </button>
          </div>
        </form>

        <div className="activate-button-container">
          <button onClick={getSignedUrl}>Activate</button>
        </div>
      </div>
    </div>
  );
}
export default UploadVideo;
