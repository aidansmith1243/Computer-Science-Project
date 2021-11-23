import { useEffect, useState } from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import Card from '../Card';

const Hand = (props) => {
  //const [cards,setCards] = useState([...props.cards])
  const { x, y, rotated, release, id, cards, setCards } = props;
  //rotated = 'left','right','down'
  const cardHeight = 140;
  const cardWidth = 90;

  const hand_style = {};
  if (rotated) {
    switch (rotated) {
      case 'left':
        hand_style.transform = 'rotate(-90deg)';
        break;
      case 'right':
        hand_style.transform = 'rotate(90deg)';
        break;
      case 'down':
        hand_style.transform = 'rotate(-180deg)';
        break;
      default:
    }
  }

  const dif = 40;
  let mod = 0 - dif;

  const getItems = () =>
    cards.map((k) => ({
      id: k.suit ? `card-${k.suit} ${k.rank}` : `card-${cards.indexOf(k)}`,
      content: <Card position={{ x: 0, y: 0 }} suit={k.suit} rank={k.rank} />,
    }));
  const [items, setItems] = useState(getItems());
  useEffect(() => {
    setItems(getItems());
  }, [cards]);

  const grid = 8;
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    display: 'flex',
    padding: grid,
    height: cardHeight,
  });

  return (
    <div
      className='Hand'
      style={{
        top: y + 'px',
        left: x + 'px',
        width: cardWidth + dif * cards.length + 'px',
        height: cardHeight + 'px',
        position: 'absolute',
      }}
    >
      <Droppable droppableId={id} direction='horizontal'>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Hand;
