import Card from '../../../Components/Card/Card';
import TopBar from '../../../Components/TopBar/Topbar';
import './Hearts.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Hand from '../../../Components/Card/Hand/Hand';
import CardSlot from '../../../Components/CardSlot/CardSlot';

const Hearts = () => {
  const [gameConnection, setGameConnection] = useState(null);

  //#region useEffects
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:60230/Game')
      .withAutomaticReconnect()
      .build();
    //newConnection.start();
    //setGameConnection(newConnection)
  }, []);
  useEffect(() => {
    (async () => {
      if (gameConnection) {
        gameConnection.on('GameUpdate', (move, gameState) => {
          console.log('GameUpdate', (move, gameState));
        });
        gameConnection.on('InvalidMove', (gameState) => {
          console.log('InvalidMove', gameState);
        });
        gameConnection.on('GameState', (gameState) => {
          console.log('GameState', gameState);
        });
      }
    })();
  }, [gameConnection]);
  //#endregion

  //#region Test card layouts
  const [myHandPlayCard, setMyHandPlayCard] = useState();
  const [myHand, setMyHand] = useState([
    { suit: 'S', rank: '8' },
    { suit: 'H', rank: '10' },
    { suit: 'C', rank: 'A' },
    { suit: 'D', rank: 'Q' },
    { suit: 'S', rank: '10' },
    { suit: 'H', rank: '9' },
    { suit: 'C', rank: 'Q' },
    { suit: 'D', rank: 'A' },
    { suit: 'H', rank: 'Q' },
    { suit: 'C', rank: '10' },
    { suit: 'D', rank: '9' },
    { suit: 'C', rank: '3' },
    { suit: 'H', rank: 'A' },
  ]);

  const [op1HandPlayCard, setOp1HandPlayCard] = useState();
  const [op1Hand, setOp1Hand] = useState([
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ]);

  const [op2HandPlayCard, setOp2HandPlayCard] = useState();
  const [op2Hand, setOp2Hand] = useState([
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ]);

  const [op3HandPlayCard, setOp3HandPlayCard] = useState();
  const [op3Hand, setOp3Hand] = useState([
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ]);
  //#endregion
  const onCardPlayed = (card) => {};

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
        </DragDropContext>
      </div>
    </div>
  );
  //#endregion
};

export default Hearts;
