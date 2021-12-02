import TopBar from '../../Components/TopBar/Topbar';
import { Navigate } from 'react-router-dom';
import './Login.css';
import { useEffect, useState } from 'react';
import { TabsProps, Tabs, Tab, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tabKey, setTabKey] = useState('login');
  const [serverError, setServerError] = useState(true);

  useEffect(() => {
    setServerError(false);
  }, [username, email, password, tabKey]);

  const submit = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:60230/auth/login/', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:60230',
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          props.setUser(username);
        } else {
          setServerError(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const register = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:60230/auth/register/', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:60230',
      },
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setTabKey('login');
        } else {
          setServerError(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='LoginPage'>
      <TopBar />
      <div className='login-register-box'>
        <Tabs
          activeKey={tabKey}
          onSelect={(k) => setTabKey(k)}
          id='tab-bar'
          className='mb-3'
        >
          <Tab title='Login' eventKey='login' className='tab'>
            {serverError ? (
              <Alert variant={'danger'}>Invalid Credentials</Alert>
            ) : (
              <div />
            )}
            <form onSubmit={submit}>
              {/* <a>Login</a> */}
              <input
                type='text'
                placeholder='Username'
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <input
                type='password'
                placeholder='Password'
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button type='submit'>Submit</button>
            </form>
          </Tab>
          <Tab title='Register' eventKey='register' className='tab'>
            {serverError ? (
              <Alert variant={'danger'}>Username taken</Alert>
            ) : (
              <div />
            )}
            <form onSubmit={register}>
              {/* <a>Register</a> */}
              <input
                type='text'
                placeholder='Username'
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <input
                type='text'
                placeholder='Email'
                required
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <input
                type='password'
                placeholder='Password'
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button type='submit'>Submit</button>
            </form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
