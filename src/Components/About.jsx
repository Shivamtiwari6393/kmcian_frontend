import toast from "react-hot-toast";
import "../Styles/About.css";

function About() {
  return (
    <div className="about-container">
      <div className="welcome-container">
        <h4>Welcome, KMCLU Students</h4>
        <p>
          We are excited to introduce Kmcian, student portal designed
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
              <b>Previous Year Papers</b> – Browse, download, and even upload
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
              university and about previous year papers, so you’re always in
              the loop.
              <br />
              <br />
              <b>Login</b> – After logging in, you can also update and
              delete papers you’ve uploaded, ensuring that content stays
              relevant and accurate. Plus, logged-in users have the ability to
              post announcements, making it easier to share information with
              classmates.
              <br />
              <br />
              Whether it’s accessing study materials, catching up on campus
              updates, or discussing academic topics, Kmcian is here to support
              your university life.
            </p>
            <i>Email : shivamtiwari6223@gmail.com</i>
          </div>
        </p>
      </div>

      <div className="comment-container">
        <h4>Suggestions/Comment</h4>
        <textarea
          name="comment"
          id="comment"
          placeholder="Start here..."
        ></textarea>

        <div className="button-container">
          <button onClick={()=>toast.success("Succesfully Posted")}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default About;
