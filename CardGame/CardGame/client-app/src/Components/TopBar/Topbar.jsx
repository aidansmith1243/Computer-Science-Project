import './TopBar.css';
import { Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const title_style = {
  height: '40px',
  backgroundColor: 'purple',
};

const TopBar = (props) => {
  const user = props.user;
  const navigate = useNavigate();
  return (
    <Navbar style={title_style} fixed='top'>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')}>Card Game</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className='justify-content-end'>
          {user ? (
            <Navbar.Text className='text-dark'>Hello, {user}</Navbar.Text>
          ) : (
            <div />
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBar;
