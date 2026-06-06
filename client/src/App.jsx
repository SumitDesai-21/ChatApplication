import React from 'react'
import Home from './components/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import JoinRoom from './components/JoinRoom'
import ChatPage from './components/ChatPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room' element={<JoinRoom />} /> 
        {/* route of room with some id */}
        <Route path='/room/:id' element={<ChatPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
