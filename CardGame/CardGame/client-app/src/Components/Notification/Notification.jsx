import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FriendList from '../FriendList/FriendList';
import './Notification.css';

const Notification = (props) => {
  const { friendHub, setShowLoading, setGameId } = props;
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (friendHub) {
      friendHub.on('GameInvite', (user, game, isValid) => {
        if (isValid) {
          setNotifications([
            ...notifications,
            {
              user: user,
              game: game,
              isFriendRequest: false,
            },
          ]);
        } else {
          setNotifications(notifications.filter((i) => i.user !== user));
          setShowLoading({ value: false, user: null });
        }
      });
      friendHub.on('FriendRequest', (user) => {
        console.log('FriendRequest', user);
        // setNotifications([
        //   ...notifications,
        //   {
        //     user: user,
        //     game: null,
        //     isFriendRequest: true,
        //   },
        // ]);
      });
      friendHub.on('GameStart', (game, id) => {
        setGameId(id);
        navigate('/hearts'); // todo - change to game path not hard code hearts
      });
    }
  }, [friendHub]);

  const declineInvite = async (e) => {
    const user = e.target.value;
    if (!friendHub._connectionStarted) {
      await friendHub.start();
    }
    friendHub.send('GameInviteResponse', user, false);
    setNotifications(notifications.filter((x) => x.user !== user));
  };
  const acceptInvite = async (e) => {
    const user = e.target.value;
    if (!friendHub._connectionStarted) {
      await friendHub.start();
    }
    friendHub.send('GameInviteResponse', user, true);
    console.log('accepting invite');
    setNotifications(notifications.filter((x) => x.user !== user));
    setShowLoading({ value: true, user: user });
  };

  return (
    <div className='Notification'>
      {notifications.map((notif) => (
        <Card
          key={notif.user}
          style={{
            width: '250px',
            marginRight: '20px',
            marginTop: '20px',
            alignItems: 'left',
          }}
        >
          <Card.Title
            style={{ fontSize: '15px', marginTop: '5px', marginBottom: '-5px' }}
          >
            {' '}
            {notif.user} wants to play {notif.game} {notif.isFriendRequest}
          </Card.Title>
          <Card.Body>
            <Button
              style={{ fontSize: '10px', marginRight: '5px' }}
              size='sm'
              variant='primary'
              onClick={acceptInvite}
              value={notif.user}
            >
              Accept
            </Button>
            <Button
              style={{ fontSize: '10px' }}
              size='sm'
              variant='secondary'
              onClick={declineInvite}
              value={notif.user}
            >
              Decline
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Notification;
