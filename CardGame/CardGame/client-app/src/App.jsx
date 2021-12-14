import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Hearts from './Pages/Games/Hearts/Hearts';
import CrazyEights from './Pages/Games/Crazy_Eights/CrazyEights';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(undefined);
  const [gameId, setGameId] = useState(undefined);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          {user ? (
            <div>
              <Route
                path=''
                element={
                  <Main user={user} setGameId={setGameId} setUser={setUser} />
                }
              />
              <Route path='/Hearts' element={<Hearts gameId={gameId} />} />
              <Route
                path='/CrazyEights'
                element={<CrazyEights gameId={gameId} />}
              />
              <Route path='/*' element={<Login setUser={setUser} />} />
            </div>
          ) : (
            <div>
              <Route path='/*' element={<Login setUser={setUser} />} />
            </div>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
