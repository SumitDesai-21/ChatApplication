import React from 'react'
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const Home = () => {
  const navigate = useNavigate();
  const goToChats = () => {
    navigate('/room')
  }
  return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "100vh",   
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography sx={{fontWeight: 'bold'}} variant='h2' gutterBottom>
            Real-Time Chat
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Create private rooms and chat with friends in real time.
          </Typography>

          <Button 
            variant="contained"
            size='large'
            sx={{
              mt: 4,
              fontWeight: 'bold'
            }}
            onClick={goToChats}
          
          >
            Get Started
          </Button>
        </Box>
      </Container>
  )
}

export default Home
