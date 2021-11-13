import './TopBar.css';

const title_style =
{
    margin: '0',
    fontSize: '30px',
};

const TopBar = () => {
    return (
    <div className='TopBar'>
        <h1 className='Title' style={title_style}>
            Card Player
        </h1>
    </div>  
    );
}
 
export default TopBar;