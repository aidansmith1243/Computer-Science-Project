import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = (props) => {
    const {title, link, info, players, invite} = props;
    console.log(invite);
    const temp = () => {
        console.log('temp')
    }
    return (
    <div className='GameCard'>
        <p className='Title'>{title} - {players} players</p>
        <a className='MoreInfo' href={info} target="_blank">i</a>
        <button onClick={invite()}>Play</button>
    </div>
    );
}
 
export default GameCard;