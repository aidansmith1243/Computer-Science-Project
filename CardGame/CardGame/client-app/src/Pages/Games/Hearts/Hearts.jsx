import Card from '../../../Components/Card/Card';
import TopBar from '../../../Components/TopBar/Topbar';
import './Hearts.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Hand from '../../../Components/Card/Hand/Hand';
import CardSlot from '../../../Components/CardSlot/CardSlot';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Hearts = (props) => {
  const { gameId } = props;
  const [gameConnection, setGameConnection] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const navigate = useNavigate();
  //#region card layouts
  const [currentTurn, setCurrentTurn] = useState(-1);

  const [myHandPlayCard, setMyHandPlayCard] = useState(null);
  const [myHand, setMyHand] = useState([]);
  const [myName, setMyName] = useState('Me');
  const [myScore, setMyScore] = useState(0);
  const [myTurnOrder, setMyTurnOrder] = useState(-1);

  const [op1HandPlayCard, setOp1HandPlayCard] = useState();
  const [op1Hand, setOp1Hand] = useState([]);
  const [op1Name, setOp1Name] = useState('Op1');
  const [op1Score, setOp1Score] = useState(0);
  const [op1TurnOrder, setOp1TurnOrder] = useState(-1);

  const [op2HandPlayCard, setOp2HandPlayCard] = useState();
  const [op2Hand, setOp2Hand] = useState([]);
  const [op2Name, setOp2Name] = useState('Op2');
  const [op2Score, setOp2Score] = useState(0);
  const [op2TurnOrder, setOp2TurnOrder] = useState(-1);

  const [op3HandPlayCard, setOp3HandPlayCard] = useState();
  const [op3Hand, setOp3Hand] = useState([]);
  const [op3Name, setOp3Name] = useState('Op3');
  const [op3Score, setOp3Score] = useState(0);
  const [op3TurnOrder, setOp3TurnOrder] = useState(-1);

  //#endregion
  //#region useEffects
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
        SetLayoutFromGameState(state, true);
      });
      newConnection.on('InvalidMove', (gameState) => {
        const state = JSON.parse(gameState);
        console.log('InvalidMove', state.Player);
        SetLayoutFromGameState(state, false);
        //setMyHand(ConvertCards(state.Player.Hand.CardDeck));
        //setMyHandPlayCard(ConvertCard(state.Player.CenterSlot));
      });
      newConnection.on('GameState', (gameState) => {
        setGameOver(false);
        const state = JSON.parse(gameState);
        console.log('GameState', state);
        SetLayoutFromGameState(state, true);
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

  const SetLayoutFromGameState = (state, shouldShowAllSlots) => {
    setCurrentTurn(state.CurrentTurn);
    console.log('setting currentTurn', state.CurrentTurn);
    // My Hand
    const myOrder = state.Player.PlayerOrder;
    setMyHand(ConvertCards(state.Player.Hand.CardDeck));
    setMyHandPlayCard(ConvertCard(state.Player.CenterSlot));
    const slot1 = ConvertCard(state.Player.CenterSlot) !== null;
    setMyName(state.Player.Name);
    setMyScore(state.Player.Score);
    if (myTurnOrder === -1) setMyTurnOrder(state.Player.PlayerOrder);

    // Op1
    const op1 = state.Others.find((x) => x.PlayerOrder === (myOrder + 1) % 4);
    const cards1 = [];
    for (let i = 0; i < op1.Hand; i++)
      cards1.push({ suit: undefined, rank: undefined });
    setOp1Hand(cards1);
    setOp1HandPlayCard(ConvertCard(op1.CardSlot));
    const slot2 = ConvertCard(op1.CardSlot) !== null;
    setOp1Name(op1.Name);
    setOp1Score(op1.Score);
    if (op1TurnOrder === -1) setOp1TurnOrder(op1.PlayerOrder);
    // Op2
    const op2 = state.Others.find((x) => x.PlayerOrder === (myOrder + 2) % 4);
    const cards2 = [];
    for (let i = 0; i < op2.Hand; i++)
      cards2.push({ suit: undefined, rank: undefined });
    setOp2Hand(cards2);
    setOp2HandPlayCard(ConvertCard(op2.CardSlot));
    const slot3 = ConvertCard(op2.CardSlot) !== null;
    setOp2Name(op2.Name);
    setOp2Score(op2.Score);
    if (op2TurnOrder === -1) setOp2TurnOrder(op2.PlayerOrder);
    // Op3
    const op3 = state.Others.find((x) => x.PlayerOrder === (myOrder + 3) % 4);
    const cards3 = [];
    for (let i = 0; i < op3.Hand; i++)
      cards3.push({ suit: undefined, rank: undefined });
    setOp3Hand(cards3);
    setOp3HandPlayCard(ConvertCard(op3.CardSlot));
    const slot4 = ConvertCard(op3.CardSlot) !== null;
    setOp3Name(op3.Name);
    setOp3Score(op3.Score);
    if (op3TurnOrder === -1) setOp3TurnOrder(op3.PlayerOrder);

    if (slot1 && slot2 && slot3 && slot4) {
      if (shouldShowAllSlots) {
        setTimeout(() => {
          setMyHandPlayCard(null);
          setOp1HandPlayCard(null);
          setOp2HandPlayCard(null);
          setOp3HandPlayCard(null);
        }, 2000);
      } else {
        setMyHandPlayCard(null);
        setOp1HandPlayCard(null);
        setOp2HandPlayCard(null);
        setOp3HandPlayCard(null);
      }
    }
  };

  const ValidateGameState = (state) => {
    const newCards = state.Player.Hand.CardDeck;
    let myCardsCorrect = myHand.length === newCards.length;
    if (!myCardsCorrect) return false;
    for (let i = 0; i < newCards.length; i++) {
      myCardsCorrect =
        myHand.filter(
          (x) => x.RANK === newCards[i].RANK && x.SUIT === newCards[i].SUIT
        ).length === 1;
      if (!myCardsCorrect) return false;
    }

    const myOrder = state.Player.PlayerOrder;
    const op1 = state.Others.find((x) => x.PlayerOrder === (myOrder + 1) % 4);
    const op2 = state.Others.find((x) => x.PlayerOrder === (myOrder + 2) % 4);
    const op3 = state.Others.find((x) => x.PlayerOrder === (myOrder + 3) % 4);

    return (
      currentTurn === state.CurrentTurn &&
      op1Hand.length === op1.Hand &&
      op2Hand.length === op2.Hand &&
      op3Hand.length === op3.Hand &&
      op1HandPlayCard === op1.CardSlot &&
      op2HandPlayCard === op1.CardSlot &&
      op3HandPlayCard === op3.CardSlot &&
      myHand === state.Player.Hand.CardDeck
    );
  };

  const GameCardPlayed = (card, state) => {
    console.log('here', state.Player);
    const myOrder = state.Player.PlayerOrder;
    console.log('here2', myOrder);
    const op1 = state.Others.find((x) => x.PlayerOrder === (myOrder + 1) % 4);
    const op2 = state.Others.find((x) => x.PlayerOrder === (myOrder + 2) % 4);
    const op3 = state.Others.find((x) => x.PlayerOrder === (myOrder + 3) % 4);
    console.log(
      `Card Played: ${card} turn: ${currentTurn} op1: ${op1TurnOrder}`
    );
    const cards = [];

    switch ((state.CurrentTurn - 1) % 4) {
      case op1.PlayerOrder:
        for (let i = 0; i < op1.Hand; i++)
          cards.push({ suit: undefined, rank: undefined });
        setOp1Hand(cards);
        setOp1HandPlayCard(card);
        console.log('op1 played');
        break;
      case op2.PlayerOrder:
        for (let i = 0; i < op2.Hand; i++)
          cards.push({ suit: undefined, rank: undefined });
        setOp2Hand(cards);
        setOp2HandPlayCard(card);
        console.log('op2 played');
        break;
      case op3.PlayerOrder:
        for (let i = 0; i < op3.Hand; i++)
          cards.push({ suit: undefined, rank: undefined });
        setOp3Hand(cards);
        setOp3HandPlayCard(card);
        console.log('op3 played');
        break;
      default:
        return;
    }

    setCurrentTurn((currentTurn + 1) % 4);
  };
  const CreateScoreboard = () => {
    const board = [
      { name: op1Name, score: op1Score },
      { name: op2Name, score: op2Score },
      { name: op3Name, score: op3Score },
      { name: myName, score: myScore },
    ];
    board.sort((f, s) => f.score < s.score);
    return (
      <div>
        {board.map((x) => (
          <p key={x.name}>
            {x.score} - {x.name}
          </p>
        ))}
      </div>
    );
  };
  const ConvertCards = (cards) => {
    const finalCards = cards.map((c) => ConvertCard(c));
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

    // do nothing if not placed at a valid location
    if (!destination) {
      return;
    }

    const sourceList = getCardList(source.droppableId);
    let destinationList = getCardList(destination.droppableId);

    // moved in its own hand
    if (source.droppableId === destination.droppableId) {
      const newItems = reorder(
        sourceList,
        result.source.index,
        result.destination.index
      );
      setCardList(source.droppableId, newItems);
      return;
    }

    // remove from current location
    const tempList = [...sourceList];
    const [removedItem] = tempList.splice(source.index, 1);
    setCardList(source.droppableId, tempList);

    // add to next location at the end
    destinationList = removedItem;
    setCardList(destination.droppableId, destinationList);
    onCardPlayed(removedItem);
  };
  const getCardList = (id) => {
    switch (id) {
      case 'myHand':
        return myHand;
      case 'myHandPlay':
        return myHandPlayCard;
      default:
        return [];
    }
  };
  const setCardList = (id, newList) => {
    switch (id) {
      case 'myHand':
        return setMyHand([...newList]);
      case 'myHandPlay':
        return setMyHandPlayCard(newList);
      default:
        return [];
    }
  };
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  //#region render
  return (
    <div className='Hearts'>
      <TopBar />

      <div className='Board'>
        <DragDropContext onDragEnd={onDragEnd}>
          <Hand
            x={160}
            y={620}
            id='myHand'
            cards={myHand}
            setCards={setMyHand}
            isDragDisabled={false}
          />
          <CardSlot x={380} y={460} id='myHandPlay' card={myHandPlayCard} />
        </DragDropContext>
        <h4
          style={{
            position: 'absolute',
            top: '790px',
            left: '190px',
            color: currentTurn === myTurnOrder ? 'gold' : 'black',
          }}
        >
          {myName} - {myScore}
        </h4>
        {/* Left */}
        <DragDropContext onDragEnd={() => {}}>
          <div style={{ position: 'absolute', transform: 'rotate(90deg)' }}>
            <Hand
              x={150}
              y={-200}
              id='op1Hand'
              cards={op1Hand}
              setCards={setOp1Hand}
              isDragDisabled={true}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'rotate(90deg)' }}>
            <CardSlot
              x={365}
              y={-370}
              id='op1HandPlay'
              card={op1HandPlayCard}
            />
          </div>
          <h4
            style={{
              position: 'absolute',
              top: '140px',
              left: '40px',
              color: currentTurn === op1TurnOrder ? 'gold' : 'black',
            }}
          >
            {op1Name} - {op1Score}
          </h4>

          {/* Top */}
          <div style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
            <Hand
              x={-680}
              y={-200}
              id='op2Hand'
              cards={op2Hand}
              setCards={setOp2Hand}
              isDragDisabled={true}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
            <CardSlot
              x={-470}
              y={-360}
              id='op2HandPlay'
              card={op2HandPlayCard}
            />
          </div>
          <h4
            style={{
              position: 'absolute',
              top: '0px',
              left: '190px',
              color: currentTurn === op2TurnOrder ? 'gold' : 'black',
            }}
          >
            {op2Name} - {op2Score}
          </h4>

          {/* Right */}
          <div style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <Hand
              x={-670}
              y={640}
              id='op3Hand'
              cards={op3Hand}
              setCards={setOp3Hand}
              isDragDisabled={true}
            />
          </div>
          <div style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            <CardSlot
              x={-455}
              y={480}
              id='op3HandPlay'
              card={op3HandPlayCard}
            />
          </div>
          <h4
            style={{
              position: 'absolute',
              top: '650px',
              left: '670px',
              color: currentTurn === op3TurnOrder ? 'gold' : 'black',
            }}
          >
            {op3Name} - {op3Score}
          </h4>
        </DragDropContext>
      </div>
      <Modal show={gameOver}>
        <Modal.Header>Game Over</Modal.Header>
        <Modal.Body>{CreateScoreboard()}</Modal.Body>
        <Modal.Footer>
          <Button variant={'primary'} onClick={() => navigate('/')}>
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  //#endregion
};

export default Hearts;
