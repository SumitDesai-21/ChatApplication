import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';



// connect io to server
const socket = io('http://localhost:3000');


const JoinRoom = () => {
  const [name, setName] = useState('');
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setInputValue(e.target.value);
  }
  const handleName = (e) => {
    setName(e.target.value);
  }

  // create new room & request server to generate Id
  const handleCreateRoom = () => {
    if (!name.trim()) {
      alert('Please enter your name first');
      return;
    }

    localStorage.setItem('chat_username', name);
    // ask server to create a room
    socket.emit('create-room', name);

    // listen once for created room ID
    socket.once('room-created', ({ roomId }) => {
      console.log("Created room:", roomId);
      navigate(`/room/${roomId}`, { state: { name } });
    });
  };

  const handleClick = () => {
    if (inputValue.trim() === '') {
      alert('Enter valid Room Id');
      return;
    }
    if (name.trim() === '') {
      alert('Please enter your name');
      return;
    }
    navigate(`/room/${inputValue}`, { state: { name } });
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            id="name"
            label="Enter your full name"
            value={name}
            onChange={handleName}

          />



          <TextField
            id="roomid"
            label="Enter room id"
            value={inputValue}
            onChange={handleChange}

          />
          {/* <button onClick={handleClick} className='mt-5 mx-auto block border border-blue-400 rounded-bl-sm p-2'>Join Lobby</button> */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleClick}
          >
            Join Room
          </Button>
          <br />

          <Divider>
            Or
          </Divider>

          {/* <button onClick={handleCreateRoom} className='mt-5 mx-auto block border border-blue-400 rounded-bl-sm p-2'>Create Room</button> */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateRoom}
          >
            Create Room
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default JoinRoom
