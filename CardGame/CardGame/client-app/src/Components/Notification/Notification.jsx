import { useState,useEffect } from "react";
import { Card,Button } from "react-bootstrap";
import {useNavigate} from 'react-router-dom';
import './Notification.css';

const Notification = (props) => {
    const {friendHub,setShowLoading} = props;
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        if(friendHub){
            friendHub.on("GameInvite", (user, game, isValid) => {
                if(isValid)
                {
                    setNotifications([...notifications,{
                        user:user,
                        game:game
                    }]);
                }
                else
                {
                    setNotifications(notifications.filter( i => i.user !== user));
                    setShowLoading({value: false,user:null});
                }
            });
            friendHub.on("GameStart", (game,id) => {
                alert(`start ${game}, ${id}`)
            })
        }
    },[friendHub])

    const declineInvite = async (e) =>
    {
        const user = e.target.value
        if(!friendHub._connectionStarted) {
            await friendHub.start();
        }
        friendHub.send("GameInviteResponse",user,false)
        setNotifications(notifications.filter(x => x.user !== user))
    };
    const acceptInvite = async (e) =>
    {
        const user = e.target.value;
        if(!friendHub._connectionStarted) {
            await friendHub.start();
        }
        friendHub.send("GameInviteResponse",user,true);
        setNotifications(notifications.filter(x => x.user !== user));
        setShowLoading({value: true,user:user});
    };

    return ( 
    <div className="Notification">
        { notifications.map( notif => (
            <Card key={notif.user} style={{ width: '250px',marginRight: '20px', marginTop: '20px',alignItems:'left' }}>
                <Card.Title style={{fontSize:"15px",marginTop: '5px',marginBottom: '-5px'}}> {notif.user} wants to play {notif.game}</Card.Title>
                <Card.Body>
                    <Button style={{fontSize:'10px', marginRight:'5px'}} size="sm" variant="primary" onClick={acceptInvite} value={notif.user}>Accept</Button>
                    <Button style={{fontSize:'10px'}} size="sm" variant="secondary" onClick={declineInvite} value={notif.user}>Decline</Button>
                </Card.Body>
            </Card>
        ))}
    </div> );
}
 
export default Notification;