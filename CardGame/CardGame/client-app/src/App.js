import logo from './logo.svg';
import './App.css';
import FriendList from './Components/FriendList/FriendList';
import TopBar from './Components/TopBar/Topbar';
import GameSelection from './Components/GameSelection/GameSelection';

function App() {
  return (
    <div className="App">
        <TopBar/>
        <FriendList/>
        <GameSelection/>
    </div>
  );
}

export default App;
