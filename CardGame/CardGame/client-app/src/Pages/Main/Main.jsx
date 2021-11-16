import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";

const Main = (props) => {
    const user = props.user;

    return (
        <div>
            <TopBar user={user}/>
            <FriendList/>
            <GameSelection/>
        </div>
    );
}
 
export default Main;