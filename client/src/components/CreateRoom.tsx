import { userState, FC, type FormEvent} from 'react';
import './CreateRoom.css';
import { type Room} from '../types/types';

interface CreateRoomProps {
    onRoomCreated: (room: Room) => void;
    rooms: Room[];
}

export const CreateRoom: FC<CreateRoomProps> = ({ onRoomCreated, rooms }) => {

    const [roomName, setRoomName] = useState('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (roomName.trim() === '') return;

        const newRoom: Room = {
            
        }

    return (
        <div className="create-room">
            {showForm ? (
                
            )}
        </div>
    )
};

export default CreateRoom;

