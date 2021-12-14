import './Card.css';
import KSULogo from './ksu.png';
const Card = (props) => {
  const { suit, rank, position, className } = props;
  // Suits: H, D, S, C
  // Ranks: A,2,3,4,5,6,7,8,9,10,J,Q,K
  const visible = suit !== undefined && rank !== undefined;
  let symbol = '?';
  const color = suit === 'H' || suit === 'D' ? 'red' : 'black';
  switch (suit) {
    case 'H':
      symbol = '♥';
      break;
    case 'D':
      symbol = '♦';
      break;
    case 'S':
      symbol = '♠';
      break;
    case 'C':
      symbol = '♣';
      break;
  }
  return (
    <div className={className !== undefined ? 'Card ' + className : 'Card'}>
      {visible ? (
        <div>
          <p
            className='Rank noselect'
            style={{ color: color, fontWeight: 'bold' }}
          >
            {rank}
          </p>
          <p className='Suit noselect' style={{ color: color }}>
            {symbol}
          </p>
          <p
            className='LargeSuit noselect'
            style={{ color: color, fontSize: '70px' }}
          >
            {symbol}
          </p>

          <p
            className='RankUpsideDown noselect'
            style={{ color: color, fontWeight: 'bold' }}
          >
            {rank}
          </p>
          <p className='SuitUpsideDown noselect' style={{ color: color }}>
            {symbol}
          </p>
        </div>
      ) : (
        <div>
          <img
            src={KSULogo}
            style={{
              position: 'absolute',
              height: '45px',
              top: '40px',
              left: '13px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
