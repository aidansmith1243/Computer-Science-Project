import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';

const Main = (props) => {
    const user = props.user;
    const friendListConnection = new HubConnectionBuilder()
       .withUrl("http://localhost:60230/Friend")
       .withAutomaticReconnect()
       .build();
    friendListConnection.start();
    friendListConnection.on("UpdateFriendList", (user, isOnline) => {
        console.log(`User: ${user} Status: ${isOnline}`);
    });

    return (
        <div>
            <TopBar user={user}/>
            <FriendList/>
            <GameSelection/>
        </div>
    );
}
 
export default Main;