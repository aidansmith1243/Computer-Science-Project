import FriendList from '../../Components/FriendList/FriendList';
import GameSelection from '../../Components/GameSelection/GameSelection';
import InviteModal from '../../Components/InviteModal/InviteModal';
import TopBar from '../../Components/TopBar/Topbar';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import Notification from '../../Components/Notification/Notification';
import LoadingModal from '../../Components/LoadingModal/LoadingModal';

const Main = (props) => {
  const { user, setGameId, setUser } = props;
  const [showInvite, setShowInvite] = useState({ value: false, game: null });
  const [showLoading, setShowLoading] = useState({ value: false, user: null });
  const [friends, setFriends] = useState([]);
  const [invitedFriends, setInvitedFriends] = useState([]);

  const [friendHub, setFriendHub] = useState(null);
  // Start Connection
  useEffect(() => {
    if (friendHub) {
      if (!friendHub._connectionStarted) {
        //friendHub.start();
      }
    }
  }, [friendHub]);
  // setup connection
  useEffect(() => {
    (async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:60230/Friend')
        .withAutomaticReconnect()
        .build();

      newConnection.on('GameInviteResponse', (user, didAccept) => {
        console.log(user, didAccept);

        setInvitedFriends((arr) =>
          arr
            .map((x) => {
              if (x.user === user) {
                x.didAccept = didAccept;
                if (didAccept) return x;
              } else {
                return x;
              }
            })
            .filter((x) => x)
        );
      });

      if (!newConnection._connectionStarted) newConnection.start();

      setFriendHub(newConnection);
    })();
  }, []);

  const logout = async () => {
    await fetch('http://localhost:60230/auth/logout/', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:60230',
      },
      method: 'POST',
      credentials: 'include',
    });
    setUser(undefined);
    friendHub.stop();
  };

  return (
    <div>
      <TopBar user={user} logout={logout} />
      <FriendList
        friendHub={friendHub}
        friends={friends}
        setFriends={setFriends}
      />
      <GameSelection setShowInvite={setShowInvite} />
      <Notification
        friendHub={friendHub}
        setShowLoading={setShowLoading}
        setGameId={setGameId}
      />
      <InviteModal
        show={showInvite}
        setShow={setShowInvite}
        friends={friends}
        friendHub={friendHub}
        invitedFriends={invitedFriends}
        setInvitedFriends={setInvitedFriends}
      />
      <LoadingModal
        show={showLoading}
        setShow={setShowLoading}
        friendHub={friendHub}
      />
    </div>
  );
};

export default Main;
