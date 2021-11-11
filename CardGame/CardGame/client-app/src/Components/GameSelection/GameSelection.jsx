import Card from '../Card/Card';
import GameCard from '../GameCard/GameCard';
import InviteModal from '../InviteModal/InviteModal';
import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './GameSelection.css';

const GameSelection = () => {
    const [showInvite, setShowInvite] = useState(false);
    const navigate = useNavigate();
    const handlePlay = () => {
        console.log('here')
        setShowInvite(true);
    };

    return ( 
    <div className='GameSelection'>
        <div className='flex-container'>
            <GameCard 
                title='Hearts'
                link='/Hearts'
                info='https://en.wikipedia.org/wiki/Hearts_(card_game)'
                players='4'
                invite={() => handlePlay}
            />
            <GameCard 
                title='Crazy Eights'
                link='/Crazy_Eights'
                info='https://en.wikipedia.org/wiki/Crazy_Eights'
                players='2+'
                invite={() => handlePlay}
            />
        </div>
        <Modal
            show={showInvite}
            centered
        >
            <Modal.Header>Invite Friends</Modal.Header>
            <Modal.Body>+</Modal.Body>
            <Modal.Footer><button onClick={()=>navigate('/Hearts')}>Play</button></Modal.Footer>
        </Modal>
    </div> 
    );
}
 
export default GameSelection;