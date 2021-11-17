import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import './FriendList.css'; 

const title_style =
{
    margin: '0',
};

const FriendList = (props) => {
    const {friendHub,friends,setFriends} = props;
    // Only update when first created
    useEffect(() => {
        friendHub.on("UpdateFriendList", (user, isOnline) => {
            console.log(`User: ${user} Status: ${isOnline}`);
            let found = false;
    
            let newFriendsList = friends.map(f => {
                if(f.user === user)
                {
                    found = true;
                    f.isOnline = isOnline;
                    return f;
                }
                return f;
            });
            if(!found)
            {
                newFriendsList.push({user: user, isOnline:isOnline})
            }
            setFriends(newFriendsList );
        });
    },[])

    return ( 
        <div className="FriendList">
            <h1 style={title_style}>
                Friends
            </h1>
            <h2>
                Online
            </h2>
            <ListGroup>
                {friends.map(u => {
                    if (u.isOnline) {
                        return <ListGroup.Item key={u.user}>{u.user}</ListGroup.Item>
                    }
                })}
            </ListGroup>
            <h2>
                Offline
            </h2>
            <ListGroup>
                {friends.map(u => {
                    if (!u.isOnline) {
                        return <ListGroup.Item key={u.user}>{u.user}</ListGroup.Item>
                    }
                })}
            </ListGroup>
        </div>
     );
}
 
export default FriendList;