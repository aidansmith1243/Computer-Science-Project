import './FriendList.css'; 

const title_style =
{
    margin: '0',
};

const FriendList = () => {
    return ( 
        <div className="FriendList">
            <h1 style={title_style}>
                Friends
            </h1>
            <h2>
                Online
            </h2>
            <h2>
                Offline
            </h2>
        </div>
     );
}
 
export default FriendList;