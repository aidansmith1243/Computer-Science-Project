import './TopBar.css';

const title_style =
{
    margin: '0',
    fontSize: '30px',
};

const TopBar = (props) => {
    const user = props.user;
    return (
    <div className='TopBar'>
        <h1 className='Title' style={title_style}>
            Card Player
        </h1>
        <p>
            Hi {user}
        </p>
    </div>  
    );
}
 
export default TopBar;