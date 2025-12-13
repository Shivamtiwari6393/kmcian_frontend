import toast from "react-hot-toast";
import "../Styles/About.css";
import { useState } from "react";

function About() {
  // const url = "http://127.0.0.1:8000/api/comment";
  const url = "https://kmcianbackend.vercel.app/api/comment";

  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  //-------- post comment function--------------

  const postComment = () => {
    if (comment == "") {
      return;
    }

    const id = toast.loading("Posting...");

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({ comment: comment }),
    })
      .then(async(response) => {

        const data = await response.json()
        if (!response.ok) throw new Error(data.message);
        toast.success(data.message || "Response posted", { id: id });
      })
      .catch((error) => {
        toast.error(error.message, { id: id });
      });
  };

  return (
    <div className="about-container">
      <div className="welcome-container">
        <h3>Welcome, KMCLU Students</h3>
        <p>
          Student portal designed
          exclusively for KMCLU! This platform has been thoughtfully crafted to
          make your academic journey smoother, providing you with essential
          resources and interactive features to help you stay connected and
          informed.
        </p>
        <p>
          Here’s what you can do on Kmcian:
          <div className="info">
            <p>
              <br />
              <b>PYQs</b> – Browse, download, and even upload
              previous year papers! Contribute to a shared resource pool, making
              exam preparation more accessible for everyone.
              <br />
              <br />
              <b>Queries & Discussions</b> – Post questions, seek advice, or
              discuss topics with fellow students. You can also reply to others,
              creating an interactive space for collaborative learning.
              <br />
              <br />
              <b> Announcements</b> – Stay informed with real-time updates on
              university and about previous year papers, so you’re always in the
              loop.
              <br />
              <br />
              <b>Login</b> – After logging in, you can also update and delete
              papers you’ve uploaded, ensuring that content stays relevant and
              accurate. Plus, logged-in users have the ability to post
              announcements, making it easier to share information.
              <br />
              <br />
              Whether it’s accessing study materials, catching up on campus
              updates, or discussing academic topics, Kmcian is here to support
              your university life.
            </p>
          </div>
        </p>
      </div>

      <div className="contact">
        <p>
          Contact:{" "}
          <a href="mailto:shivamtiwari6223@gmail.com" style={{color: "white"}}>
            shivamtiwari6223@gmail.com
          </a>{" "}
        </p>
      </div>
      <div className="comment-container">
        <h4>Suggestions/Comment</h4>
        <textarea
          name="comment"
          id="comment"
          placeholder="Start here..."
          onChange={handleChange}
          value={comment}
        ></textarea>

        <div className="button-container">
          <button onClick={() => postComment()}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default About;
