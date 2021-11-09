import Card from '../Card/Card';
import GameCard from '../GameCard/GameCard';
import './GameSelection.css';
const GameSelection = () => {
    return ( 
    <div className='GameSelection'>
        <div className='flex-container'>
            <GameCard 
                title='Hearts'
                link='/Hearts'
                info='https://en.wikipedia.org/wiki/Hearts_(card_game)'
                players='4'
            />
            <GameCard 
                title='Crazy Eights'
                link='/Crazy_Eights'
                info='https://en.wikipedia.org/wiki/Crazy_Eights'
                players='2+'
            />
        </div>
    </div> 
    );
}
 
export default GameSelection;