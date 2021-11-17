import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';
import { useEffect } from "react";
import Notification from "../../Components/Notification/Notification";

const Main = (props) => {
    const user = props.user;
    const friendListConnection = new HubConnectionBuilder()
       .withUrl("http://localhost:60230/Friend")
       .withAutomaticReconnect()
       .build();
       useEffect(() => {
        friendListConnection.start();
       },[])

    return (
        <div>
            <TopBar user={user}/>
            <FriendList friendUpdate = {friendListConnection}/>
            <GameSelection/>
            <Notification/>
        </div>
    );
}
 
export default Main;