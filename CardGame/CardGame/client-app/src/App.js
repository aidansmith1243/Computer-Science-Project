import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';
import ErrorPage from './Pages/ErrorPage/ErrorPage';
import Hearts from './Pages/Games/Hearts/Hearts';
import CrazyEights from './Pages/Games/Crazy_Eights/CrazyEights';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path = "" element = {<Login/>}/>
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/home" element = {<Main/>} />
        <Route path = "/*" element = {<ErrorPage/>} />
        <Route path = "/Hearts" element = {<Hearts/>} />
        <Route path = "/CrazyEights" element = {<CrazyEights/>} />
    </Routes>
   </BrowserRouter>
    </div>
  );
}

export default App;
