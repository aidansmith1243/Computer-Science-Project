import Button from '@restart/ui/esm/Button';
import { useEffect, useState } from 'react';
import { ListGroup, Modal } from 'react-bootstrap';
import './FriendList.css';

const title_style = {
  margin: '0',
};

const FriendList = (props) => {
  const { friendHub, friends, setFriends } = props;
  const [addModal, setAddModal] = useState(false);
  const [newFriend, setNewFriend] = useState('');
  // Only update when first created
  useEffect(() => {
    if (friendHub) {
      friendHub.on('UpdateFriendList', (user, isOnline) => {
        console.log(`User: ${user} Status: ${isOnline}`);
        let found = false;

        const newFriendsList = friends.map((f) => {
          if (f.user === user) {
            found = true;
            f.isOnline = isOnline;
            return f;
          }
          return f;
        });
        if (!found) {
          newFriendsList.push({ user: user, isOnline: isOnline });
          friends.push({ user: user, isOnline: isOnline });
        }
        setFriends(newFriendsList);
      });
    }
  }, [friendHub]);
  const AddFriend = () => {
    if (newFriend != '' && friendHub) {
      friendHub.send('FriendRequest', newFriend, true);
    } else {
      console.log('ERR sending friend request');
    }
    setAddModal(false);
  };
  return (
    <div className='FriendList'>
      <h1 style={title_style}>Friends</h1>
      <h2>Online</h2>
      <ListGroup>
        {friends.map((u) => {
          if (u.isOnline) {
            return <ListGroup.Item key={u.user}>{u.user}</ListGroup.Item>;
          }
        })}
      </ListGroup>
      <h2>Offline</h2>
      <ListGroup>
        {friends.map((u) => {
          if (!u.isOnline) {
            return <ListGroup.Item key={u.user}>{u.user}</ListGroup.Item>;
          }
        })}
      </ListGroup>
      <Button
        onClick={() => {
          setAddModal(true);
        }}
      >
        +
      </Button>
      <Modal show={addModal}>
        <Modal.Header>Add Friend</Modal.Header>
        <Modal.Body>
          <input
            type='text'
            onChange={(e) => setNewFriend(e.target.value)}
            placeholder='Username'
          ></input>
          <Button onClick={() => AddFriend()}>Submit</Button>
          <Button onClick={() => setAddModal(false)}>Cancel</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FriendList;
