import { position } from 'dom-helpers';
import Card from '../../../Components/Card/Card';
import TopBar from '../../../Components/TopBar/Topbar';
import './Hearts.css';

const Hearts = () => {
    const my_hand = [
        {suit: 'S', rank:'8'},
        {suit: 'H', rank:'10'},
        {suit: 'C', rank:'A'},
        {suit: 'D', rank:'Q'},
    ]
    const op1_hand = [
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
    ]
    const op2_hand = [
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
    ]
    const op3_hand = [
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
        {suit: undefined, rank:undefined},
    ]

    const createFacingHand = (x,y,cards,sideways=false) => {
        let cardElements = []; 
        let mod_x = x;
        let mod_y = y;
        for(let i = 0; i < cards.length; i++)
        {
            cardElements.push(
                <Card 
                    key={Math.random()}
                    className={sideways ? 'CardSideways':''}
                    suit={cards[i].suit} rank={cards[i].rank} 
                    position={{x: mod_x, y: mod_y}}
                />
            )
            sideways ? mod_y += 40 : mod_x += 40;
        }
        
        return cardElements; 
    }

    return ( 
    <div className='Hearts'>
        <TopBar/>
        <div className='Board'>
            {createFacingHand(600,700,my_hand)}
            {createFacingHand(50,200,op1_hand,true)}
            {createFacingHand(600,50,op2_hand)}
            {createFacingHand(1200,200,op3_hand,true)}
            {/* <Card suit={'S'} rank={'8'} position={{x: 0, y: 0}}/>
            <Card suit={'H'} rank={'Q'} position={{x: 25, y: 0}}/>
            <Card suit={'C'} rank={'4'} position={{x: 196, y: 0}}/>
            <Card suit={'D'} rank={'A'} position={{x: 221, y: 0}}/>
            <Card suit={'S'} rank={'10'} position={{x: 221, y: 40}}/>
            <Card position={{x: 400, y: 40}}/> */}
        </div>
    </div> 
    );
}
 
export default Hearts;