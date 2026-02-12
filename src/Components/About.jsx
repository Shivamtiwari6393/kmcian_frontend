import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "../Styles/About.css";

const MAX_LENGTH = 500;

function About() {
  const API_URL = import.meta.env.VITE_API_URL + "/api/comment";

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setComment(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const Commenttrimmed = comment.trim();

    if (!Commenttrimmed) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (Commenttrimmed.length < 3) {
      toast.error("Comment must be at least 3 characters");
      return;
    }

    const loadId = toast.loading("Posting...");

    try {
      setLoading(true);

      abortControllerRef.current = new AbortController();

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: Commenttrimmed }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      toast.success(data.message || "Comment posted successfully", {
        id: loadId,
      });

      setComment("");
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error(error.message || "Something went wrong", { id: loadId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="about-container">
      <div className="welcome-container">
        <h1>Welcome, KMCLU Students</h1>

        <p>
          Kmcian is your dedicated student portal — built to simplify access to
          academic resources, discussions, announcements, and collaboration.
          <br />
          Kmcian is here to support your university journey.
        </p>
        <div>
          <p>Here’s what you can do on Kmcian:</p>

          <div className="info">
            <p>
              <b>PYQs</b> – Browse, download, and upload previous year question
              papers.
              <br />
              <b>Shorts</b> –Students can upload, watch, and share short
              academic or informational videos. Designed to make learning more
              engaging and interactive.
              <br />
              <b>Queries & Discussions</b> – Post questions and collaborate with
              peers.
              <br />
              <b>Announcements</b> – Stay updated with university notifications.
              <br />
              <b>Login</b> – Manage your uploads, queries and other resources.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact">
        <span>Contact:</span>

        <a href="mailto:shivamtiwari6223@gmail.com">
          shivamtiwari6223@gmail.com
        </a>

        <a
          href="https://t.me/bit0001101"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram contact"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </a>
      </div>

      {/* Comment Section */}
      <div className="comment-container">
        <h2>Suggestions / Comment</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            name="comment"
            placeholder="Write your suggestion..."
            value={comment}
            onChange={handleChange}
            disabled={loading}
            aria-label="Comment input"
            maxLength={MAX_LENGTH}
          />

          <div className="comment-meta">
            <span>
              {comment.length}/{MAX_LENGTH}
            </span>
          </div>

          <div className="button-container">
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="button"
            >
              {loading ? "Posting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default About;
