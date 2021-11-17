import TopBar from "../../Components/TopBar/Topbar";
import { Navigate } from "react-router-dom";
import './Login.css';
import { useState } from "react";

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        await fetch('http://localhost:60230/auth/login/',{
            headers: {'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:60230"},
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(
                {
                    username,
                    password
                }
            )
        })
        .then(response => {
            if(response.ok)
            {
                props.setUser(username)
                //setRedirect(true);
            }
        })
        .catch(err => {
            console.log(err);
        });

    }

    if(redirect) {
        return <Navigate to="/home"/>
    }

    return ( 
    <div className='LoginPage'>
        <TopBar/>
        <form onSubmit={submit}>
            <a>Login</a>
            <input type='text' placeholder='Username' required onChange={e => setUsername(e.target.value)}></input>
            <input type='password' placeholder='Password' required onChange={e => setPassword(e.target.value)}></input>
            <button type='submit'>Submit</button>
        </form>
    </div> 
    );
}
 
export default Login;