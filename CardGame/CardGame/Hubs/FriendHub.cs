using CardGame.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
        public FriendHub(CardGameRepository cardGameRepository)
        {
            _cardGameRepository = cardGameRepository;
        }
        //public Task UpdateFriendList()
        //{
        //    //Clients.Client("").SendAsync("","",false);
        //    return Clients.All.SendAsync("UpdateFriendList", "name", false);
        //}
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"User Connected to FriendHub: " +
                $"{_cardGameRepository.GetUserById(Context.User.Identity.Name)?.Username}");

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
            
            // Get current online users
            foreach(var friend in _cardGameRepository.GetFriends(userId))
            {
                if (friend.isOnline)
                {
                    Clients.Client(Context.ConnectionId).SendAsync("UpdateFriendList", friend.Username, true);
                }
            }

            // Join other users groups to be notified when they get online
            var userFriends = _cardGameRepository.GetFriends(userId);
            foreach (var friend in userFriends)
            {
                Groups.AddToGroupAsync(Context.ConnectionId, friend.UserId.ToString());
            }

            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
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
