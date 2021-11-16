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
        public Task UpdateFriendList()
        {
            return Clients.All.SendAsync("UpdateFriendList", null, null);
        }
        public override Task OnConnectedAsync()
        {
            Console.WriteLine($"User Connected to FriendHub: " +
                $"{_cardGameRepository.GetUserById(Context.User.Identity.Name)?.Username}");
            return base.OnConnectedAsync();
        }
    }
}
