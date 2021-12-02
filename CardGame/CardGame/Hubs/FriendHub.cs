using CardGame.Games;
using CardGame.Models;
using CardGame.Models.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Hubs
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class FriendHub : Hub
    {
        private readonly CardGameRepository _cardGameRepository;
        private readonly GameList _gameList;
        public FriendHub(CardGameRepository cardGameRepository, GameList gameList)
        {
            _cardGameRepository = cardGameRepository;
            _gameList = gameList;
        }
        [NonAction]
        public User GetUser()
        {
            return _cardGameRepository.GetUserById(Context.User.Identity.Name); ;
        }
        public Task GameStart(string game,List<string> players)
        {
            var me = GetUser();
            players.Add(me.Username);
            string gameId = _gameList.CreateGame(game, players);
            foreach (var p in players)
            {
                Clients.Group(p).SendAsync("GameStart", game, gameId);
            }
            return Task.CompletedTask;

        }
        public Task FriendRequest(string user)
        {
            var me = GetUser();
            var friend = _cardGameRepository.GetUserByUsername(user);
            if (me == null || friend == null) return Task.CompletedTask;

            Console.WriteLine($"Friend Request {me.Username} to {user}");
            // Add friend in db and send invite
            var newFriend = _cardGameRepository.AddFriend(me.Username, user);
            if (newFriend) Clients.Group(user).SendAsync("FriendRequest", me.Username);

            // Join friends group to get online updates
            Groups.AddToGroupAsync(Context.ConnectionId, friend.UserId.ToString());

            return Task.CompletedTask;
        }
        //public Task FriendSearch(string search)
        //{
        //    var possibleUsers = _cardGameRepository.GetUsers
        //    return Task.CompletedTask;
        //}
        public Task GameInvite(string user,string game,bool valid)
        {
            //Console.WriteLine($"GameInvite {user}, {game}, {valid}");
            // Send invite to the user that is in their group
            var me = GetUser();
            return Clients.Group(user).SendAsync("GameInvite",me.Username, game, valid);
        }
        public Task GameInviteResponse(string user, bool didAccept)
        {
            // responde to the inviter if they joined the game
            //Console.WriteLine($"GameInviteResponse: {user}, {didAccept}");
            var me = GetUser();
            return Clients.Group(user).SendAsync("GameInviteResponse", me.Username, didAccept);
        }
        public override Task OnConnectedAsync()
        {
            //Console.WriteLine($"User Connected to FriendHub: " +
               // $"{_cardGameRepository.GetUserById(Context.User.Identity.Name)?.Username}");

            var user = _cardGameRepository.GetUserById(Context.User.Identity.Name);
            if (user == null)
            {
                Console.WriteLine("ERROR: hub user not found");
                return base.OnConnectedAsync();
            }
            var userId = user.UserId.ToString();

            // Save online status to database
            _cardGameRepository.SetOnlineStatus(userId,true);

            // Update all my Friends I am online
            Clients.Group(userId).SendAsync("UpdateFriendList", user.Username, true);
            
            // Get users friends
            foreach(var friend in _cardGameRepository.GetFriends(userId))
            {
                Clients.Client(Context.ConnectionId).SendAsync("UpdateFriendList", friend.Username, friend.isOnline);
            }

            // Join other users groups to be notified when they get online
            var userFriends = _cardGameRepository.GetFriends(userId);
            foreach (var friend in userFriends)
            {
                Console.WriteLine($"User: {user.Username} Joined Group: {friend.Username}");
                Groups.AddToGroupAsync(Context.ConnectionId, friend.UserId.ToString());
            }

            // Get all pending friend requests
            foreach(var f in _cardGameRepository.GetPendingInvites(user.UserId.ToString()))
            {
                Clients.Client(Context.ConnectionId).SendAsync("FriendRequest", f);
            }

            // Join my group to receive game invites
            Groups.AddToGroupAsync(Context.ConnectionId, user.Username);

            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            //Console.WriteLine($"User Disconnected to FriendHub: " +
              //  $"{_cardGameRepository.GetUserById(Context.User.Identity.Name)?.Username}");
            var user = _cardGameRepository.GetUserById(Context.User.Identity.Name);
            if (user == null)
            {
                Console.WriteLine("ERROR: hub user not found for disconnect");
                return base.OnDisconnectedAsync(exception);
            }

            var userId = user.UserId.ToString();

            // Save online status to database
            _cardGameRepository.SetOnlineStatus(userId, true);

            // Update all my friends I am offline
            Clients.Group(userId).SendAsync("UpdateFriendList", user.Username, false);

            return base.OnDisconnectedAsync(exception);
        }
    }
}
