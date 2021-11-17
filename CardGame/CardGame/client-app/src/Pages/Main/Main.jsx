import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';
import { useEffect } from "react";

const Main = (props) => {
    const user = props.user;
    const friendListConnection = new HubConnectionBuilder()
       .withUrl("http://localhost:60230/Friend")
       .withAutomaticReconnect()
       .build();
       useEffect(() => {
        friendListConnection.start();
       },[])
    
    // friendListConnection.on("UpdateFriendList", (user, isOnline) => {
    //     console.log(`User: ${user} Status: ${isOnline}`);
    // });

    return (
        <div>
            <TopBar user={user}/>
            <FriendList friendUpdate = {friendListConnection}/>
            <GameSelection/>
        </div>
    );
}
 
export default Main;