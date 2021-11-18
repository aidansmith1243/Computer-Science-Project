import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import InviteModal from '../../Components/InviteModal/InviteModal';
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';
import { useEffect,useState } from "react";
import Notification from "../../Components/Notification/Notification";
import {useNavigate} from 'react-router-dom';

const Main = (props) => {
    const user = props.user;
    const [showInvite, setShowInvite] = useState(false);
    const [friends,setFriends] = useState([]);

    const [friendHub,setFriendHub] = useState(null);
    // Start Connection
    useEffect(() => {
        if(friendHub) {
            friendHub.start()
                .then(result => {
                    console.log(result)
                })
                .catch(e => console.log(e))
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
                />
            <InviteModal 
                show={showInvite} 
                setShow={setShowInvite}
                friends={friends} 
                friendHub={friendHub}
                />
        </div>
    );
}
 
export default Main;