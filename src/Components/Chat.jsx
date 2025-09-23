/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../Styles/Chat.css";
import toast from "react-hot-toast";

const Chat = () => {
  const url = "https://kmcianbackend.vercel.app"
  // const url = "http://127.0.0.1:8000";

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
    { content: "xdcfvgbhnm,", sender: "drfghjnmk,l" },
  ]);

  const socket = useRef(null);

  const loadId = useRef(null);

  const handleSendMessage = () => {
    if (message) {
      if (socket.current) {
        loadId.current = toast.loading("sending");
        console.log("message send", message);
        socket.current.emit("chatMessage", { content: message, sender: "st" });
        setMessage("");
      }
    }
  };

  useEffect(() => {
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
      toast.success("message sent", { id: loadId.current });

      setChats((prevChats) => [...prevChats, msg]);
    };

    socket.current.on("chatMessage", handleChatMessage);

    return () => {
      if (socket.current) {
        socket.current.off("chatMessage", handleChatMessage);
        socket.current.disconnect();
      }
    };
  }, [url]);

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
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
