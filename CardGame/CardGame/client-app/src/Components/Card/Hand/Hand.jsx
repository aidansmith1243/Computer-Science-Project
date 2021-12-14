import { useEffect, useState } from 'react';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import Card from '../Card';

const Hand = (props) => {
  const { x, y, rotated, release, id, cards, setCards, isDragDisabled } = props;
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

  const grid = 8;
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    //padding: grid * 2,
    paddingRight: 32,
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    display: 'flex',

    height: cardHeight,
  });

  return (
    <div
      className='Hand'
      style={{
        top: y + 'px',
        left: x + 'px',
        width: cardWidth + dif * (cards ? cards.length : 0) + 'px',
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
            {cards ? (
              cards.map((k) => (
                <Draggable
                  isDragDisabled={isDragDisabled}
                  key={
                    k.suit
                      ? `card-${k.suit} ${k.rank}`
                      : `card-${cards.indexOf(k)}`
                  }
                  draggableId={
                    k.suit
                      ? `card-${k.suit} ${k.rank}`
                      : `card-${cards.indexOf(k)}`
                  }
                  index={cards.indexOf(k)}
                >
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
                      <Card
                        position={{ x: 0, y: 0 }}
                        suit={k.suit ? k.suit : k.SUIT}
                        rank={k.rank ? k.rank : k.RANK}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            ) : (
              <div />
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Hand;
