import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { io } from 'socket.io-client';
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // using useParams access roomId
  const { id: roomId } = useParams();

  // use useNavigate & useLocation
  const navigate = useNavigate();
  const location = useLocation();


  // initialize name from localStorage first
  const [name, setName] = useState(() => {
    return localStorage.getItem('chat_username') || '';
  });

  // define ref here
  const socketRef = useRef();

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  // effect to handle name persistence
  useEffect(() => {
    const stateName = location.state?.name;

    // if we have a name from navigation i.e when took first time
    // And it's different from storage 
    if (stateName && stateName !== name) {
      localStorage.setItem('chat_username', stateName);
      setName(stateName);
    }
    else if (!name) {
      navigate('/');
    }
  }, [name, location.state, navigate])

  // old messages may remain if users go from roomA to roomB 
  // to prevent that
  useEffect(() => {
    setMessages([]);
  }, [roomId]);


  useEffect(() => {
    if (!name) return;
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log(`Connected with id: ${socketRef.current.id}`);
      socketRef.current.emit("join-room", roomId, name);
    })

    socketRef.current.on('message-sent', (payload) => {
      setMessages((prev) => [...prev, { ...payload, type: "sent" }]);
    });

    socketRef.current.on('message-received', (payload) => {
      setMessages((prev) => [...prev, { ...payload, type: "received" }]);

    });

    // fetch old messaged in room
    // so that when user joins a room he/she can see those messages
    // are already there

    socketRef.current.on('room-history', (msgs) => {
      setMessages(msgs.map(msg => ({
        text: msg.text,
        sender: msg.sender,
        type: msg.sender === name ? "sent" : "received" // Compare with current user's name
      })));
    });

    // socketRef.current.emit('custom-event', 10, "hi", { a: 'a' });
    // cleanup on unmount
    return () => {
      socketRef.current.off('message-sent');
      socketRef.current.off('message-received');
      socketRef.current.off('room-history');
      socketRef.current.off(`connect`);
      socketRef.current.disconnect();
    };

  }, [roomId, name])


  const handleClick = () => {
    if (message.trim() !== '') {
      if (!socketRef.current?.connected) {
        alert("Not connected to server");
        return;
      }
      socketRef.current.emit('send-message', message, roomId);
      setMessage('');
    } else {
      alert('Enter a message!');
    }
  };

  return (

    <div className="flex flex-col h-screen p-4 bg-pink-100">
      <div className="bg-white border-b p-4 shadow">
        <h2 className="font-bold">
          Room: {roomId}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.type === "sent"
                  ? "bg-blue-500 text-white"
                  : "bg-white shadow"
                }`}
            >
              <span className="text-xs font-semibold opacity-80">
                {msg.type === "sent" ? "You" : msg.sender}
              </span>
              <p className="text-sm mt-1">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 bg-white border-t">
        {/* add Enter-to-Send feature */}
        <textarea
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleClick();
            }
          }}
          className="w-full max-w-2xl p-2 border rounded"
          placeholder="Enter your message"
          value={message}
          onChange={handleChange}
        />
        <button onClick={handleClick} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage