import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder } from '@microsoft/signalr';
import TopBar from '../../../Components/TopBar/Topbar';
import { DragDropContext } from 'react-beautiful-dnd';
import Hand from '../../../Components/Card/Hand/Hand';
import CardSlot from '../../../Components/CardSlot/CardSlot';

const CrazyEights = (props) => {
  const { gameId } = props;
  const [gameConnection, setGameConnection] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();

  const [gameState, setGameState] = useState({
    myHand: [{ rank: '2', suit: 'D' }],
  });

  //#region useEffect
  useEffect(() => {
    (async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl('http://localhost:60230/Game')
        .withAutomaticReconnect()
        .build();

      newConnection.on('GameUpdate', (m, gameState) => {
        const state = JSON.parse(gameState);
        const move = JSON.parse(m);
        move.RANK = move.rank;
        move.SUIT = move.suit;
        console.log('GameUpdate', state);

        setGameState(state);
      });

      newConnection.on('InvalidMove', (gameState) => {
        const state = JSON.parse(gameState);
        console.log('InvalidMove', state.Player);

        setGameState(state);
      });

      newConnection.on('GameState', (gameState) => {
        setGameOver(false);
        const state = JSON.parse(gameState);
        console.log('GameState', state);

        setGameState(state);
      });

      newConnection.on('GameOver', (gameState) => {
        const state = JSON.parse(gameState);

        setGameOver(true);
      });

      if (!newConnection._connectionStarted) await newConnection.start();
      setGameConnection(newConnection);
    })().catch((err) => console.log(err));
  }, []);
  //#endregion

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
  };

  return (
    <div className='Hearts'>
      <TopBar />
      <div className='Board'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Hand x={0} y={0} id='myHand' cards={gameState.myHand} />

          <CardSlot x={300} y={300} id='playCard' card={gameState.centerSlot} />
          <CardSlot
            x={425}
            y={300}
            id='drawPile'
            card={{ rank: undefined, suit: undefined }}
            onClick={() => console.log('draw')}
          />
        </DragDropContext>
      </div>
    </div>
  );
};

export default CrazyEights;
