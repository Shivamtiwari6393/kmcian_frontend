/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import "../Styles/Announcment.css";
import Loading from "./Loading";
import toast from "react-hot-toast";

function Announcment() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [announcments, setAnnouncments] = useState([]);
  const page = useRef(0);
  const [totalPage, setTotalPage] = useState(2);

  const handleClick = () => {
    if (page.current + 1 < totalPage) page.current = page.current + 1;
    else return;
    fetchh();
  };

  const fetchh = () => {
    setLoading(true);

    // const url = "http://127.0.0.1:8000"
    const url = "https://kmcianbackend.vercel.app"



    fetch(`${url}/api/announcment/${page.current}`)
      .then((res) => {
        if (res.status != 200) {
          return res.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log(data, "fetched data");
        setAnnouncments((prev) => [...prev, ...data.announcments]);
        setTotalPage(data.totalPage + 1);
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
        className={show ? "announcment-container-in" : "announcment-container"}
      >
        {loading && <Loading></Loading>}
        {console.log(announcments, "wanna")}
        <div className="announcements">
          {announcments?.map((Announcment, index) => (
            <>
              <div className="announcment" key={index}>
                <p>{Announcment.content}</p>
                <div className="time-container">
                  <span>
                    {new Date(Announcment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="button-container">
          <button onClick={handleClick}>
            {announcments[0] ? "more..." : "Show Announcments"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Announcment;
