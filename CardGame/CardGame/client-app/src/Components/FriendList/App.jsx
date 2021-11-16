import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Hearts from './Pages/Games/Hearts/Hearts';
import CrazyEights from './Pages/Games/Crazy_Eights/CrazyEights';
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(undefined);

  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        { user ? 
        <div>
          <Route path = "" element = {<Main user={user}/>} />
          <Route path = "/home" element = {<Main user={user}/>} />
          <Route path = "/Hearts" element = {<Hearts/>} />
          <Route path = "/CrazyEights" element = {<CrazyEights/>} />
        </div>
          :
        <div>
          <Route path = "" element = {<Login setUser={setUser}/>}/>
          <Route path = "/login" element = {<Login setUser={setUser}/>}/>
        </div>
        }
        <Route path = "/*" element = {<ErrorPage/>} />
        
    </Routes>
   </BrowserRouter>
    </div>
  );
}

export default App;
