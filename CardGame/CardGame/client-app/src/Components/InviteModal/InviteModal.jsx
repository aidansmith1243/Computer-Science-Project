import { Modal,Button, Dropdown,ListGroup } from 'react-bootstrap';
import './InviteModal.css';
import { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

const InviteModal = (props) => {
    const {show,friends,friendHub,setShow} = props;
    const [invitedFriends, setInvitedFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if(friendHub){
                friendHub.on("GameInviteResponse", (user, didAccept) => {
                    console.log("Game Invite Response");
                    if(didAccept)
                    {
                        console.log(invitedFriends)
                        setInvitedFriends(invitedFriends.map(x => {
                            if(x.user=== user){
                                x.didAccept = true;
                            }
                            return x; 
                        }));
                    }
                    else
                    {
                        setInvitedFriends(invitedFriends.filter( i => i.user !== user));
                    }
                })
            }
        })();
    },[friendHub]);
    useEffect(() => {console.log("invited friends:",invitedFriends)},[invitedFriends]);
    useEffect(() => {console.log("friends:",friends)},[friends]);
    const handleCancelInvite = async (e) => {
        if(invitedFriends.length > 0){
            if(!friendHub._connectionStarted) {
                await friendHub.start();
            }
            invitedFriends.forEach(e => {
                friendHub.send("GameInvite",e.user,"",false)
            });
        }
        setInvitedFriends([]);
        setShow(false);
    };
    const handleInvite = (e,user,game) => {
        if(!friendHub._connectionStarted) {
            friendHub.start().then(res=>{});
        }
        friendHub.send("GameInvite",user,game,true);
        const friend = friends.filter(x => x.user === user)[0];
        friend.didAccept = false;
        const tempFriends = invitedFriends;
        tempFriends.push(friend)
        setInvitedFriends(tempFriends);
    };
    const handlePlay = async (e) => {
        if(!friendHub._connectionStarted) {
            await friendHub.start();
        }
        //await friendHub.send("GameInvite","","",true)
        //navigate("/hearts")
    };

    return ( 
        <Modal
            show={show}
            centered
        >
            <Modal.Header>Invite Friends</Modal.Header>
            <Modal.Body>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Select Friend
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {
                        friends.filter(x => x.isOnline && x.didAccept === undefined).map(x => 
                            <Dropdown.Item key={x.user} value={x.user} onClick={(e)=>handleInvite(e,x.user,'game')}>{x.user}</Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
            <ListGroup style={{marginTop:"10px"}}>
                {
                    invitedFriends.map(u => 
                        <div key={u.user}>
                        <ListGroup.Item>{u.user}</ListGroup.Item>
                        <p>{u.didAccept ? "Ready" : "Pending"}</p>
                        </div>
                    )
                }
            </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={(e) => handleCancelInvite(e,"test")}>
                    Cancel
                </Button>
                <Button onClick={(e)=>handlePlay(e)}>
                    Play
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
 
export default InviteModal;