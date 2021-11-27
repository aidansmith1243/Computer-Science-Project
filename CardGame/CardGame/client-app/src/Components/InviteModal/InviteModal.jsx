import { Modal, Button, Dropdown, ListGroup } from 'react-bootstrap';
import './InviteModal.css';
import { useEffect, useState } from 'react';

const InviteModal = (props) => {
  const { show, friends, friendHub, setShow } = props;
  const [invitedFriends, setInvitedFriends] = useState([]);

  useEffect(() => {
    (async () => {
      if (friendHub) {
        friendHub.on('GameInviteResponse', (user, didAccept) => {
          console.log('A1');
          if (didAccept) {
            console.log('A1');
            setInvitedFriends(
              invitedFriends.map((x) => {
                if (x.user === user) {
                  x.didAccept = true;
                }
                return x;
              })
            );
            console.log(invitedFriends);
          } else {
            console.log('A3');
            setInvitedFriends(invitedFriends.filter((i) => i.user !== user));
            console.log('A4');
          }
        });
      }
      console.log(invitedFriends);
    })();
  }, [friendHub]);

  const handleCancelInvite = async (e) => {
    if (invitedFriends.length > 0) {
      if (!friendHub._connectionStarted) {
        await friendHub.start();
      }
      invitedFriends.forEach((e) => {
        friendHub.send('GameInvite', e.user, show.game, false);
      });
    }
    setInvitedFriends([]);
    setShow({ value: false, game: null });
  };
  const handleInvite = async (e, user) => {
    if (!friendHub._connectionStarted) {
      await friendHub.start().then((res) => {});
    }
    await friendHub.send('GameInvite', user, show.game, true);
    const friend = friends.filter((x) => x.user === user)[0];

    friend.didAccept = false;
    const tempFriends = invitedFriends;
    tempFriends.push(friend);
    setInvitedFriends([...tempFriends]);
  };
  const handlePlay = async (e) => {
    if (!friendHub._connectionStarted) {
      await friendHub.start();
    }
    const playingFriends = invitedFriends
      .filter((x) => x.didAccept)
      .map((x) => x.user);
    await friendHub.send('GameStart', show.game, playingFriends);
  };

  return (
    <Modal show={show.value} centered>
      <Modal.Header>Invite Friends to play {show.game}</Modal.Header>
      <Modal.Body>
        <Dropdown>
          <Dropdown.Toggle variant='success' id='dropdown-basic'>
            Select Friend
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {friends
              .filter(
                (x) =>
                  x.isOnline &&
                  invitedFriends.filter((y) => y.user === x.user).length === 0
              )
              .map((x) => (
                <Dropdown.Item
                  key={x.user}
                  value={x.user}
                  onClick={(e) => handleInvite(e, x.user)}
                >
                  {x.user}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <ListGroup style={{ marginTop: '10px' }}>
          {invitedFriends.map((u) => (
            <div key={u.user}>
              <ListGroup.Item>{u.user}</ListGroup.Item>
              <p>{u.didAccept ? 'Ready' : 'Pending'}</p>
            </div>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='secondary'
          onClick={(e) => handleCancelInvite(e, 'test')}
        >
          Cancel
        </Button>
        <Button onClick={(e) => handlePlay(e)}>Play</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
