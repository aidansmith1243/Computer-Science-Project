import { Droppable } from 'react-beautiful-dnd';
import Card from '../Card/Card';
import './CardSlot.css';

const CardSlot = (props) => {
  const { x, y, id, card } = props;

  return (
    <div className='CardSlot' style={{ top: y, left: x }}>
      <Droppable droppableId={id} direction='horizontal'>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {card ? (
              <div style={{ top: '-4px', left: '-4px', position: 'absolute' }}>
                <Card suit={card.suit} rank={card.rank} />
              </div>
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

export default CardSlot;
