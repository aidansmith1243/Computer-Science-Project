import Card from '../../../Components/Card/Card';
import TopBar from '../../../Components/TopBar/Topbar';
import './Hearts.css';
const Hearts = () => {
    return ( 
    <div className='Hearts'>
        <TopBar/>
        <div className='Board'>
            <Card suit={'S'} rank={'8'} position={{x: 0, y: 0}}/>
            <Card suit={'H'} rank={'Q'} position={{x: 25, y: 0}}/>
            <Card suit={'C'} rank={'4'} position={{x: 196, y: 0}}/>
            <Card suit={'D'} rank={'A'} position={{x: 221, y: 0}}/>
            <Card suit={'S'} rank={'10'} position={{x: 221, y: 40}}/>
            <Card position={{x: 400, y: 40}}/>
        </div>
    </div> 
    );
}
 
export default Hearts;