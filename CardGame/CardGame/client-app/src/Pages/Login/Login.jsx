import TopBar from "../../Components/TopBar/Topbar";
import { Link } from "react-router-dom";
import './Login.css';

const Login = () => {

    const handleSubmit = (event) => {

    }

    return ( 
    <div className='LoginPage'>
        <TopBar/>
        <form onSubmit={handleSubmit} action='/home'>
            <a>Login</a>
            <input type='text' placeholder='Username'></input>
            <input type='password' placeholder='Password'></input>
            <input type='submit'></input>
        </form>
    </div> 
    );
}
 
export default Login;