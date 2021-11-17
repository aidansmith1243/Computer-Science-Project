import { useState } from "react";
import { Card,Button } from "react-bootstrap";
import './Notification.css';

const Notification = () => {
    const notifExample = {
        user:"root",
        game:"Hearts",
    };
    const notifExample2 = {
        user:"root2",
        game:"Crazy Eights",
    };
    const [notifications, setNotifications] = useState([notifExample,notifExample2]);

    const declineInvite = (e) =>
    {
        const user = e.target.value
        setNotifications(notifications.filter(x => x.user !== user))
    };
    const acceptInvite = (e) =>
    {
        const user = e.target.value
        setNotifications(notifications.filter(x => x.user !== user))
        // todo join waiting room
    };

    return ( 
    <div className="Notification">
        { notifications.map( notif => (
            <Card key={notif.user} style={{ width: '250px',marginRight: '20px', marginTop: '20px',alignItems:'left' }}>
                <Card.Title style={{fontSize:"15px",marginTop: '5px',marginBottom: '-5px'}}> {notif.user} invited you to play {notif.game}</Card.Title>
                <Card.Body>
                    <Button style={{fontSize:'10px', marginRight:'5px'}} size="sm" variant="primary" value={notif.user}>Accept</Button>
                    <Button style={{fontSize:'10px'}} size="sm" variant="secondary" onClick={declineInvite} value={notif.user}>Decline</Button>
                </Card.Body>
            </Card>
        ))}
    </div> );
}
 
export default Notification;