import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import Card from "../Card";

const Hand = (props) => {
    const [cards,setCards] = useState([...props.cards])
    const {x,y,rotated,release} = props
    //rotated = 'left','right','down'
    const cardHeight = 140;
    const cardWidth = 90;
    

    const hand_style = {}
    if(rotated){
        switch (rotated) {
            case 'left':
                hand_style.transform = "rotate(-90deg)"
                break;
            case 'right':
                hand_style.transform = "rotate(90deg)"
                break;
            case 'down':
                hand_style.transform = "rotate(-180deg)"
                break;
            default:
        }
    }

    const dif = 40;
    let mod = 0-dif;
    return ( <div style={{
            top: y + 'px',
            left: x + 'px',
            width: (cardWidth + dif * cards.length) + 'px',
            height: cardHeight + 'px',
            position:'absolute'}}>
        {
            
            cards.map(card => {
                console.log(mod)
                return (
                    <div key={card.suit + card.rank}>
                        <Draggable 
                            onStop={(e,data) =>release(e,data)}
                            title="temp">
                                
                            <div>
                                <Card style={hand_style}
                                    position={{x:(mod+=dif),y:0}}
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