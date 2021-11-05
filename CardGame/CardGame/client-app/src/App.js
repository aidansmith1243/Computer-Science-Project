import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Main from './Pages/Main/Main';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path = "" element = {<Login/>}/>
        <Route path = "/login" element = {<Login/>} />
        <Route path = "/home" element = {<Main/>} />
        <Route path = "/*" element = {<ErrorPage/>} />
    </Routes>
   </BrowserRouter>
    </div>
  );
}

export default App;
