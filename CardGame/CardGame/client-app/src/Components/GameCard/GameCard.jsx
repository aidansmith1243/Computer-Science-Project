import { Link } from 'react-router-dom';
import './GameCard.css';

const GameCard = (props) => {
    const {title, link, info, players} = props;

    return (
    <div className='GameCard'>
        <p className='Title'>{title} - {players} players</p>
        <a className='MoreInfo' href={info} target="_blank">i</a>
        <button><Link to={link}>Play</Link></button>
    </div>
    );
}
 
export default GameCard;