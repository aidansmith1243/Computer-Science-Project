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
    CenterSlot: [{ rank: '2', suit: 'D' }],
    CurrentTurn: 0,
    DrawPile: 35,
    Others: [
      {
        Name: 'op1',
        Hand: 5,
        PlayerOrder: 1,
      },
    ],
    Player: {
      Name: 'me',
      PlayerOrder: 0,
      Hand: {
        CardDeck: [],
      },
    },
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
  useEffect(() => {
    if (gameConnection && gameConnection._connectionStarted) {
      gameConnection.send('JoinGame', gameId);
    }
  }, [gameConnection]);
  //#endregion

  const ConvertCards = (cards) => {
    let finalCards = [];
    if (typeof cards === typeof 0) {
      for (let i = 0; i < cards; i++) {
        finalCards.push({ rank: undefined, suit: undefined });
      }
    } else {
      finalCards = cards.map((c) => ConvertCard(c));
    }
    return finalCards;
  };

  const ConvertCard = (card) => {
    if (card == null) return null;
    const finalCard = {
      suit: card.SUIT,
      rank: card.RANK === '0' ? '10' : card.RANK,
    };
    return finalCard;
  };

  const onCardPlayed = async (card) => {
    if (!gameConnection._connectionStarted) {
      await gameConnection.start();
    }
    gameConnection.send('Play', gameId, JSON.stringify(card));
    console.log('play', card);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === 'myHand' &&
      destination.droppableId === 'playCard'
    ) {
      // remove from current location
      const tempList = [...gameState.Player.Hand.CardDeck];
      const [removedItem] = tempList.splice(source.index, 1);
      gameState.Player.Hand.CardDeck = tempList;

      // add to next location at the end
      gameState.CenterSlot.push(removedItem);
      setGameState((_) => gameState);
      onCardPlayed(removedItem);
    }
  };

  return (
    <div className='CrazyEights'>
      <TopBar />
      <div className='Board'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Hand
            x={192}
            y={652}
            id='myHand'
            cards={ConvertCards(gameState.Player?.Hand?.CardDeck)}
          />

          <CardSlot
            x={310}
            y={320}
            id='playCard'
            card={
              gameState.CenterSlot
                ? ConvertCard(
                    gameState.CenterSlot[gameState.CenterSlot.length - 1]
                  )
                : undefined
            }
          />

          <CardSlot
            x={435}
            y={320}
            id='drawPile'
            card={{ rank: undefined, suit: undefined }}
            onClick={() => console.log('draw')}
          />
          <div style={{ position: 'absolute', transform: 'rotate(90deg)' }}>
            <Hand
              x={182}
              y={-168}
              id='op1'
              cards={
                gameState.Others?.length > 1
                  ? ConvertCards(
                      gameState.Others.filter(
                        (x) =>
                          x.PlayerOrder ===
                          (gameState.Player.PlayerOrder + 1) %
                            (gameState.Others.length + 1)
                      )[0].Hand
                    )
                  : []
              }
            />
          </div>
          <div style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
            <Hand
              x={-648}
              y={-168}
              id='op2'
              cards={
                gameState.Others && gameState.Others?.length !== 2
                  ? ConvertCards(
                      gameState.Others.filter(
                        (x) =>
                          x.PlayerOrder ===
                          (gameState.Player.PlayerOrder +
                            (gameState.Others.length === 1 ? 1 : 2)) %
                            (gameState.Others.length + 1)
                      )[0].Hand
                    )
                  : []
              }
            />
          </div>
          <div style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <Hand
              x={-638}
              y={672}
              id='op3'
              cards={
                gameState.Others?.length > 1
                  ? ConvertCards(
                      gameState.Others.filter(
                        (x) =>
                          x.PlayerOrder ===
                          (gameState.Player.PlayerOrder +
                            (gameState.Others.length === 2 ? 2 : 3)) %
                            (gameState.Others.length + 1)
                      )[0].Hand
                    )
                  : []
              }
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CrazyEights;
