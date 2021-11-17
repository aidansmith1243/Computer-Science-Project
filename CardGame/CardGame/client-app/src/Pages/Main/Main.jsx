import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import InviteModal from '../../Components/InviteModal/InviteModal';
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';
import { useEffect,useState } from "react";
import Notification from "../../Components/Notification/Notification";

const Main = (props) => {
    const user = props.user;
    const [showInvite, setShowInvite] = useState(false);
    const [friends,setFriends] = useState([]);
    const friendHub = new HubConnectionBuilder()
       .withUrl("http://localhost:60230/Friend")
       .withAutomaticReconnect()
       .build();
    useEffect(async () => {
        await friendHub.start();
        friendHub.send("test","test");
    },[])
    const cancelInvite = async () => {
        await friendHub.invoke("GameInvite",null,null,true).then(res => {
            console.log(res)
        })
    }

    return (
        <div>
            <TopBar user={user}/>
            <FriendList friendHub={friendHub} friends={friends} setFriends={setFriends}/>
            <GameSelection setShowInvite={setShowInvite}/>
            <Notification friendHub={friendHub}/>
            <InviteModal show={showInvite} setShow={setShowInvite} friendHub={friendHub} friends={friends} cancelInvite={cancelInvite}/>
        </div>
    );
}
 
export default Main;