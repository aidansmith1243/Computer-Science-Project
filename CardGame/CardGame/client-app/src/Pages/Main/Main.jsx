import FriendList from "../../Components/FriendList/FriendList";
import GameSelection from "../../Components/GameSelection/GameSelection";
import TopBar from "../../Components/TopBar/Topbar";

const Main = () => {
    return (
        <div>
            <TopBar/>
            <FriendList/>
            <GameSelection/>
        </div>
    );
}
 
export default Main;