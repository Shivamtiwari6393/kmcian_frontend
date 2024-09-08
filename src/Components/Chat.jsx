import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../Styles/Chat.css";

import go from '../assets/go.png'

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  const socket = useRef(null);

  useEffect(() => {

    // const url = "http://127.0.0.1:8000"
    const url = "https://kmcianbackend.vercel.app"
    socket.current = io(url);

    socket.current.on("connect", () => {
      console.log("Connected to the WebSocket server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from the WebSocket server");
    });
    socket.current.on("error", (err) => {
      console.log("Socket error:", err);
    });


    const handleChatMessage = (msg) => {
      console.log("Message received:", msg);
      setChats((prevChats) => [...prevChats, msg]);
    };

    socket.current.on("chatMessage", handleChatMessage);

    return () => {
      if (socket.current) {
        socket.current.off("chatMessage", handleChatMessage);
        socket.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (message) {
      if (socket.current) {
        console.log("message send", message);
        socket.current.emit("chatMessage", { content: message, sender: "st" });
        setMessage("");
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="message-container">
        {chats.map((chat, index) => (
          <div className="chat-element" key={index}>
            <p key={index}>{chat.content}</p>
            <sub>{chat.sender}</sub>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Drop your Query"
        />
       <img src={go} alt="go" onClick={handleSendMessage} title="Send"/>
      </div>
    </div>
  );
};

export default Chat;
