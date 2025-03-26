import { useState } from 'react'
import { io } from 'socket.io-client';
import { CreateRoom } from './components/CreateRoom';
import { User, Room, Message } from './types/types';
import './App.css'

function App() {

  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  const handleRoomCreated = (roomName: string) => {
    console.log('Room created:', roomName);
    const newRoom: Room = {
      id: '1',
      name: roomName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRooms([...rooms, newRoom]);
  }

  if(!user){
    return <Login onLogin={setUser} />
  }

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="user-info">
          <h3>Welcome, User</h3>
        </div>
        <CreateRoom onRoomCreated={handleRoomCreated} rooms={rooms} />
      </div>
    </div>

  )
}

export default App
