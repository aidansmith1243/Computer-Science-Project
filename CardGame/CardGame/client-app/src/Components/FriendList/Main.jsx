import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";
import {HubConnectionBuilder} from '@microsoft/signalr';

const Main = (props) => {
    const user = props.user;
    const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:60230/Friend")
        .withAutomaticReconnect()
        .build();
    connection.start();
        // connection.on("ReceiveMessage", (user, message) => {
        //     const msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //     const encodedMsg = `${user} says ${msg}`;
        //     console.log(encodedMsg);
        // });
    
    return (
        <div>
            <TopBar user={user}/>
            <FriendList/>
            <GameSelection/>
        </div>
    );
}
 
export default Main;