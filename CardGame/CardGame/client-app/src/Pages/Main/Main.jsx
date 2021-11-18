import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import InviteModal from '../../Components/InviteModal/InviteModal';
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';
import { useEffect,useState } from "react";
import Notification from "../../Components/Notification/Notification";
import {useNavigate} from 'react-router-dom';
import LoadingModal from "../../Components/LoadingModal/LoadingModal";

const Main = (props) => {
    const {user,setGameId} = props;
    const [showInvite, setShowInvite] = useState({value: false, game: null});
    const [showLoading, setShowLoading] = useState({value: false, user: null});
    const [friends,setFriends] = useState([]);

    const [friendHub,setFriendHub] = useState(null);
    // Start Connection
    useEffect(() => {
        if(friendHub) {
            if(!friendHub._connectionStarted) {
                friendHub.start();
            }
        }
    },[friendHub])
    // setup connection
    useEffect(() => {
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:60230/Friend')
            .withAutomaticReconnect()
            .build();

            setFriendHub(newConnection);
    },[])

    return (
        <div>
            <TopBar 
                user={user}
                />
            <FriendList 
                friendHub={friendHub} 
                friends={friends} 
                setFriends={setFriends}
                />
            <GameSelection 
                setShowInvite={setShowInvite}
                />
            <Notification 
                friendHub={friendHub}
                setShowLoading={setShowLoading}
                setGameId={setGameId}
                />
            <InviteModal 
                show={showInvite} 
                setShow={setShowInvite}
                friends={friends} 
                friendHub={friendHub}
                />
            <LoadingModal 
                show={showLoading} 
                setShow={setShowLoading}
                friendHub={friendHub}
                />
        </div>
    );
}
 
export default Main;