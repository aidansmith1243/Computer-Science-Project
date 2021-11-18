import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import Card from "../Card";

const Hand = (props) => {
    const [cards,setCards] = useState([...props.cards])
    const {x,y,rotated} = props
    //rotated = 'left','right','down'

    return ( <div style={{width:0}}>
        {
            cards.map(card => {
                return (
                    <div key={card.suit + card.rank}>
                        <Draggable >
                            <div>
                                <Card 
                                    position={{x:x,y:y}}
                                    suit={card.suit}
                                    rank={card.rank}
                                    />
                            </div>
                        </Draggable>
                    </div>
                )}
            )
        }
    </div> );
}
 
export default Hand;