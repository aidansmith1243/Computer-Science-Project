import Card from '../Card/Card';
import GameCard from '../GameCard/GameCard';
import InviteModal from '../InviteModal/InviteModal';
import React, {useState} from 'react';
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import './GameSelection.css';

const GameSelection = () => {
    const [showInvite, setShowInvite] = useState(false);
    const handlePlay = (e) => {
        const game = e.target.value
        console.log(game)
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
                invite={(e) => handlePlay}
            />
            <GameCard 
                title='Crazy Eights'
                link='/Crazy_Eights'
                info='https://en.wikipedia.org/wiki/Crazy_Eights'
                players='2+'
                invite={(e) => handlePlay}
            />
        </div>
        <InviteModal show={showInvite} setShow={setShowInvite}/>
    </div> 
    );
}
 
export default GameSelection;