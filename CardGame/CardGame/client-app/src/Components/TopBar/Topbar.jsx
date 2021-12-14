import './TopBar.css';
import { Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const title_style = {
  height: '40px',
  backgroundColor: 'purple',
};

const TopBar = (props) => {
  const user = props.user;
  const logout = props.logout;
  const navigate = useNavigate();
  return (
    <Navbar style={title_style} fixed='top'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>
          Shuffle Box Royale
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {user ? (
            <Navbar.Text onClick={() => logout()} className='text-dark'>
              Hello, {user}
            </Navbar.Text>
          ) : (
            <div />
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
