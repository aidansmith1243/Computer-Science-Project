import Card from '../../../Components/Card/Card';
import TopBar from '../../../Components/TopBar/Topbar';
import './Hearts.css';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import Hand from '../../../Components/Card/Hand/Hand';

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
  const [myHand, setMyHand] = useState([
    { suit: 'S', rank: '8' },
    { suit: 'H', rank: '10' },
    { suit: 'C', rank: 'A' },
    { suit: 'D', rank: 'Q' },
    { suit: 'S', rank: '10' },
    { suit: 'H', rank: '9' },
    { suit: 'C', rank: 'Q' },
    { suit: 'D', rank: 'A' },
  ]);
  const [op1Hand, setOp1Hand] = useState([
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ]);
  const op2_hand = [
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ];
  const op3_hand = [
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
    { suit: undefined, rank: undefined },
  ];
  //#endregion

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // do nothing if not placed at a valid location
    if (!destination) {
      return;
    }

    const sourceList = getCardList(source.droppableId);
    const destinationList = getCardList(destination.droppableId);

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

    // add to next location
    destinationList.push(removedItem);
    setCardList(destination.droppableId, destinationList);
  };
  const getCardList = (id) => {
    switch (id) {
      case 'myHand':
        return myHand;
      case 'op1Hand':
        return op1Hand;
      default:
        return;
    }
  };
  const setCardList = (id, newList) => {
    switch (id) {
      case 'myHand':
        return setMyHand([...newList]);
      case 'op1Hand':
        return setOp1Hand([...newList]);
      default:
        return;
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
            x={100}
            y={200}
            id='myHand'
            cards={myHand}
            setCards={setMyHand}
          />
          <Hand
            x={100}
            y={500}
            id='op1Hand'
            cards={op1Hand}
            setCards={setOp1Hand}
          />
        </DragDropContext>
      </div>
    </div>
  );
  //#endregion
};

export default Hearts;
